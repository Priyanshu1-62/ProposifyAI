# ProposifyAI — Voice Service: Project Context

## 1. Overview
- ProposifyAI (RFP management) is being rebuilt from Express.js into a Spring Boot backend (`server/`: core-api + workers).
- This document covers the **voice-bot**: an independent, agentic, end-to-end AI voice bot.
- Goal is learning to own such a product at company grade: keep it **minimal but scalable**, add features one at a time.
- **Out of scope for now:** RAG (added later as a tool/helper function).
- Working mode: I write the code myself, then bring drafts for review; Claude explains, reviews, and flags bugs. Claude writes a file only when I explicitly ask for it. Keep theory short.
- Type checking: Pylance strict-ish (unknown generics are flagged).

## 2. Stack and Decisions
| Area | Decision |
|---|---|
| Framework | FastAPI (async), Pydantic (validation), SQLAlchemy async + asyncpg, Alembic |
| Supporting libs | httpx, pyjwt, structlog, tenacity, pytest, pytest-asyncio, ruff |
| Providers | **Provider-agnostic**: STT, TTS, LLM each behind an interface; one provider per slot initially |
| Pipeline style | Cascaded (STT → LLM → TTS), not speech-to-speech |
| Database | Own Postgres DB; no shared tables with core-api |
| Live session state | In memory in the process holding the WebSocket; Redis only when scaling to multiple instances |
| Transport | Browser WebSocket: binary audio frames + JSON control frames |
| Inbound audio | PCM16, 16 kHz mono, 20 ms frames (640 bytes) |
| Outbound audio | Resampled **server-side to 16 kHz**; format declared to client in `ready` |
| Endpointing | **Provider-side first**; own VAD (behind a `VAD` interface) added with barge-in |
| Interruption history | Persist and keep in LLM history **only the spoken portion** of an interrupted reply |
| Settings | `get_settings()` with `lru_cache` (no module-level instance); `extra="ignore"`; `NoDecode` for comma-separated CORS origins |
| Internal types | Frozen, slotted **dataclasses** for events/messages (hot path, internal); Pydantic only at trust boundaries (tool args, WS payloads) |
| Python | 3.11+ (`asyncio.timeout`, `timeout_at`) |

## 3. System Architecture
- **Frontend** calls core-api (dashboard) and voice-bot (voice component) via an **API gateway** routing by path (`/api/*` → core-api, `/voice/*` → voice-bot). The audio WebSocket connects directly to voice-bot.
- **Auth:** core-api issues a short-lived, narrow-scope session ticket (JWT, asymmetric signing). voice-bot only verifies it. Ticket sent in the first WS `start` message (not the query string). Settings for verification (public key/JWKS, algorithm, issuer, audience) are added at step 6, not before.
- **Service interaction:** REST/gRPC for synchronous calls (e.g. core-api lookups), events (Kafka) for aftermath (`call.completed`).
- **Contracts** (explicit, language-neutral, no shared code or DB):
  - REST: auto-generated OpenAPI (FastAPI / springdoc).
  - Events: JSON Schema in `contracts/events/` (versioned); possibly Avro + schema registry later.
  - Auth: `contracts/auth/jwt-claims.md`.

```
Mic ─▶ [WebSocket] ─▶ (VAD) ─▶ STT (stream) ─▶ Session Manager
                                                    │
                                    Agent (loop ⇄ LLM ⇄ tools)
                                                    │ token stream
Speaker ◀─ [WebSocket] ◀─ TTS (stream) ◀─ Sentence chunker ◀──┘
```

**Core principles**
- Pipeline of concurrent async tasks connected by queues; every stage streams and overlaps.
- **Interruption = cancellation:** cancel LLM + TTS tasks, flush outbound audio, notify client, return to LISTENING. Every stage must be cancellable (cleanup in `finally`; never swallow `CancelledError`).
- Latency target (design goal): ~1s from end of speech to first audio.

## 4. Low-Level Design

### 4.1 Concurrency model (per call)
`CallSession` owns three long-lived tasks connected by `asyncio.Queue`s:
- **Inbound loop:** reads WS frames; binary → audio-in queue, JSON → control handling.
- **Turn loop:** consumes endpointed utterances; runs one turn at a time (agent → chunker → TTS).
- **Outbound loop:** the **single writer** to the WebSocket (audio, transcripts, state events). Makes flush-on-interrupt = drain one queue.
- Each turn runs in its own `asyncio.TaskGroup`, stored as `current_turn`. Every outbound item carries a **turn ID**; stale items from a cancelled turn are dropped.

### 4.2 Provider interfaces (ABC, shaped by streaming + cancellation)
- **STT:** open stream per call, push audio chunks, async iterator of `partial` / `final` / (optional) `speech_started`/`speech_ended`; clean `close()`.
- **LLM (implemented):** `generate_stream(messages, tools, params) -> AsyncGenerator[LLMEvent, None]` (a plain `def` in the ABC; adapters implement it as `async def` + `yield`). Events: `TextDelta`, `ToolCall(id, name, args)`, `Usage`, `Done(stop_reason)`. Stream contract: only complete `ToolCall`s, `Usage` at most once, `Done` last. Plus `provider_name`, `model`, `aclose()`.
- **TTS:** input = one sentence; output = async iterator of PCM chunks (resampled to 16 kHz downstream).
- **VAD** (added with barge-in): frame in → speech start/end signals; tunables: start threshold, end-silence (~500–700 ms), min speech length.
- Retries wrap only the connection / pre-first-token phase.

### 4.3 State machine
| From | Event | To |
|---|---|---|
| LISTENING | endpoint + non-empty final transcript | THINKING |
| THINKING | first TTS audio chunk queued | SPEAKING |
| THINKING / SPEAKING | speech-start (barge-in) | INTERRUPTED → LISTENING |
| SPEAKING | turn done + outbound drained | LISTENING |
| any | client `end`, disconnect, error, idle timeout | ENDED |

INTERRUPTED is transient: cancel `current_turn`, await it, flush outbound queue, send `interrupted`, record spoken text only.

### 4.4 Turn pipeline
```
final transcript → Agent.run() → TextChunk → SentenceChunker → TTS queue → TTS → outbound queue
                              → ToolStarted/ToolFinished (optional client cue)
```
- **Chunker:** emit on sentence boundaries (guard abbreviations/decimals) + length/time fallback flush; optional short early first chunk. Tracks which sentences were actually delivered (needed for spoken-only history).
- TTS runs as its own task so LLM generation overlaps with speech. Bounded queues for backpressure; never drop audio silently.

### 4.5 Agent loop (implemented, `agent/agent.py`)
- `Agent(llm, registry, AgentConfig).run(history, user_text, ctx)` is an async generator of `TextChunk | ToolStarted | ToolFinished | TurnDone`.
- `TurnDone(new_messages, usage, iterations, end_reason)`; `end_reason` ∈ completed / iteration_cap / llm_error / budget / timeout. The agent never mutates the history passed in; the session manager appends `new_messages` (substituting the spoken portion on barge-in; a cancelled turn produces no `TurnDone`).
- Loop: `trim_context` → stream LLM → on tool calls: append `AssistantMessage(text, tool_calls)`, run calls **sequentially** via the registry, append results in call order → repeat; else yield final text and `TurnDone`.
- Retries (exponential backoff + full jitter, honors `retry_after`) only while opening the stream/waiting for the first event, only for `retryable` errors, and only if the deadline allows.
- Timeouts: first-token timeout and a wall-clock turn deadline, applied with `asyncio.timeout_at` only around awaits on the LLM stream (never across `yield`s).
- Every abnormal ending (LLM failure, content filter, budget error, timeout, iteration cap) yields a spoken fallback line and a `TurnDone`; text already streamed before a mid-stream failure is kept in the history message. Never catches `CancelledError`; streams closed via `aclosing`.
- One structlog `llm_call` line per call (provider, model, prompt version, tokens, TTFT, latency, stop reason).
- `AgentConfig` (system prompt, prompt version, context budget, iteration cap, timeouts, attempts, params, fallback text) is built from settings at startup, not read inside the agent.

### 4.6 Tools (implemented, `agent/tools/`)
- `Tool[ArgsT]` ABC: class attributes `name`, `description`, `args_model`, `required_scope`, `timeout_s`, `has_side_effects`; `execute(args, ctx) -> str`; `to_spec()` builds the JSON schema from the Pydantic args model. `ToolError` = expected failure with a model-safe message. `ToolContext(user_id, session_id, scopes: frozenset[str])` comes from the JWT; tools never trust model-supplied identity.
- `ToolRegistry`: `register` (rejects duplicates), `specs_for(scopes)` (only permitted tools shown to the model), `execute(call, ctx) -> ToolResult(message, status, duration_s)`. Pipeline: lookup → re-check scope → `model_validate_json` → run under `asyncio.timeout` → truncate output. **Never raises for tool failures** (unknown tool, denied, invalid args, timeout, tool error, crash all become error `ToolMessage`s; crash details only in logs). `CancelledError` propagates. Registry holds `Tool[Any]` (alias `AnyTool`) to satisfy the type checker.
- Placeholder tool: `get_current_time` (scope `tools:basic`). v1 also needs one read-only core-api lookup (step 6); no side-effect tools.

### 4.7 Context trimming (implemented, `agent/context.py`)
- `trim_context(system_prompt, history, tools, max_tokens, count_tokens) -> TrimResult(messages, tokens, dropped_blocks)`. History is split into **turn blocks** (user message through the final reply, including tool calls and results); whole blocks dropped oldest-first so a tool call is never split from its result. Newest block never dropped (including an unfinished tool round). Raises `ContextBudgetError` instead of sending a broken context. Token counting is an injectable callable (conservative `len/3` estimator by default); tool specs and tool-call args are counted. `max_tokens` is the input budget (reserve output tokens first).

### 4.8 Prompts (implemented, `agent/prompts/`)
- `system_v1.md` (voice-style: short spoken replies, no markdown) + `load_prompt(version)` (cached); the version = file stem, logged per call.

### 4.9 Persistence
- Tables: `sessions` (user, start/end, end_reason, prompt_version), `turns` (session, seq, role, text, interrupted, spoken_text, timestamps, stage latencies), `tool_calls` (turn, tool, args, result summary, status, duration), `llm_calls` (turn, provider, model, prompt_version, tokens, TTFT, total latency, status).
- Written at turn boundaries by a **background writer task** (off the hot path); DB down ⇒ call continues, warn + bounded retry.
- Repositories in `db/repositories/` own all SQL.

### 4.10 WebSocket protocol (v1, versioned in `start`/`ready`)
- Client → server: `start` (ticket), binary audio, `end`.
- Server → client: `ready` (outbound audio format), `state`, `transcript` (partial/final), `bot_text` (optional), binary audio, `interrupted`, `error`, `ended`.

### 4.11 Layer boundaries
- `api/v1/voice_ws.py`: thin; verify ticket, create `CallSession`, hand over socket.
- `services/`: `call_session.py` (loops + state machine), `session_registry.py` (active sessions, per-user concurrency cap).
- `pipeline/`: `stt/`, `tts/`, `vad/` (each `base.py` + one adapter), `chunker.py`.
- `agent/`: `agent.py`, `context.py`, `llm/` (`types.py`, `errors.py`, `base.py`, adapter), `tools/` (`base.py`, `registry.py`, tool modules), `prompts/`.
- `integrations/`: core-api client (httpx, timeout, retry), event publisher.
- `core/`: pydantic-settings config, structlog (bind `session_id`, `turn_id` via context vars), JWT verification.
- Dependency direction: `api → services → agent/pipeline/db/integrations`; lower layers never import upward.

## 5. Features: Now vs Later
**Now:** streaming at every stage; interruption handling; per-stage timeouts; retries with exponential backoff + jitter (only before first token); agent iteration cap; tool arg validation and permissions; prompt versioning; structured logging with per-stage latency; sliding-window token budget; per-user session concurrency cap; usage logging.

**Next:** fallback model / model switching; per-user cost limits; circuit breaker; history summarization.

**Later:** caching (provider prompt caching first); Redis for multi-instance; eval harness; load testing.

**With RAG:** source citation, hallucination handling, confidence scoring.

## 6. Repo Layout
```
proposifyai/
├── server/          # Spring Boot (core-api, workers)
├── voice-bot/       # FastAPI
├── contracts/       # openapi/, events/, auth/
├── (frontend)/
└── docker-compose.yml
```
```
voice-bot/
├── app/
│   ├── main.py
│   ├── core/          # config, logging, security
│   ├── api/           # deps.py, v1/ (health, sessions, voice_ws)
│   ├── schemas/       # Pydantic models (API/WS payloads)
│   ├── db/            # base, session, models/, repositories/
│   ├── services/      # call_session, session_registry
│   ├── agent/
│   │   ├── agent.py, context.py
│   │   ├── llm/       # types.py, errors.py, base.py, <provider>.py
│   │   ├── tools/     # base.py, registry.py, current_time.py
│   │   └── prompts/   # system_v1.md, loader
│   ├── pipeline/      # stt/, tts/, vad/, chunker
│   └── integrations/  # core-api client, event publishing
├── alembic/
├── scripts/           # chat_cli.py (throwaway terminal harness)
├── tests/             # fakes/fake_llm.py, agent/, conftest.py
├── .env.example, .gitignore, requirements.txt, README.md
```

## 7. Current State
- Done: venv, packages, folder structure, alembic async init, `main.py` with `/` and `/health`, `.gitignore`, `.env.example`, `core/config.py`; architecture and LLD finalized.
- **Build step 1 code is written** (reviewed by Claude): `llm/types.py`, `llm/errors.py`, `llm/base.py`, `tools/base.py`, `tools/registry.py`, `tools/current_time.py`, `prompts/system_v1.md` + loader, `context.py`, `agent.py`.
- Still open in step 1:
  1. Pick the LLM provider and write the real adapter (`llm/<provider>.py`: map vendor stream → normalized events, assemble tool-call fragments, map vendor errors → `LLMError` subclasses, `aclose()`); add provider settings (API key as `SecretStr`, model, timeouts).
  2. Wire-up: build `AgentConfig` from settings, register `CurrentTimeTool`, load the prompt, grant scope `tools:basic` to the session.
  3. `scripts/chat_cli.py`: terminal loop that keeps history, streams `TextChunk`s, appends `TurnDone.new_messages`.
  4. Tests (paused for a couple of days): fake provider (`tests/fakes/fake_llm.py`, scripted turns, records calls, exceptions in script, optional event delay, `closed_streams` counter), then registry tests, context-trimming tests, agent-loop tests (plain answer, tool round, tool error/timeout, malformed args, iteration cap, retry before first token, cancellation cleanup). pytest-asyncio with `asyncio_mode = auto`, `pythonpath = .`.
- Next chat: choose the LLM provider (ask Claude to look up current options), then adapter → CLI → tests; after that step 2.

## 8. Build Order
1. Text-only agent (LLM event types + provider interface, adapter, streaming, function calling, tool registry, loop) + test harness — **code written; adapter, CLI, tests pending**
2. Session manager, state machine, persistence, migrations
3. TTS out (text in → streamed audio, sentence chunker, 16 kHz resample)
4. STT in + provider-side endpointing → full voice loop with minimal browser test page
5. Barge-in (own VAD + interruption across all stages, spoken-only history)
6. Integration: ticket auth, core-api tool, `call.completed` event
7. Hardening: fallbacks, metrics, concurrent-session load test

## 9. Still Open (decide when reached)
- Provider picks: LLM now (step 1 adapter); TTS at step 3; STT at step 4
- Policy when an LLM reply stops with `length` (currently treated as a normal end and logged)
- Exact VAD library and thresholds (step 5)
- Chunker heuristics and early-first-chunk tuning (step 3)
- Whether to persist `ToolResult` status/duration into `tool_calls` directly from the agent events (step 2)