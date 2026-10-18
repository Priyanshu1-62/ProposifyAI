# ProposifyAI — Voice Service: Project Context

## 1. Overview
- ProposifyAI (RFP management) is being rebuilt from Express.js into a Spring Boot backend (`server/`: core-api + workers).
- This document covers the **voice-bot**: an independent, agentic, end-to-end AI voice bot.
- Goal is learning to own such a product at company grade: keep it **minimal but scalable**, add features one at a time.
- **Out of scope for now:** RAG (added later as a tool/helper function).
- Working mode: I write all code myself; Claude explains, reviews, and flags bugs.

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

## 3. System Architecture
- **Frontend** calls core-api (dashboard) and voice-bot (voice component) via an **API gateway** routing by path (`/api/*` → core-api, `/voice/*` → voice-bot). The audio WebSocket connects directly to voice-bot.
- **Auth:** core-api issues a short-lived, narrow-scope session ticket (JWT, asymmetric signing). voice-bot only verifies it. Ticket sent in the first WS `start` message (not the query string).
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

### 4.2 Provider interfaces (`Protocol`/ABC, shaped by streaming + cancellation)
- **STT:** open stream per call, push audio chunks, async iterator of `partial` / `final` / (optional) `speech_started`/`speech_ended`; clean `close()`.
- **LLM:** input = messages, tool schemas, params; output = normalized event stream: `text_delta`, `tool_call(id, name, args)`, `usage`, `done(stop_reason)`. Adapter accumulates partial tool-call JSON and emits only complete calls.
- **TTS:** input = one sentence; output = async iterator of PCM chunks (resampled to 16 kHz downstream).
- **VAD** (added with barge-in): frame in → speech start/end signals; tunables: start threshold, end-silence (~500–700 ms), min speech length.
- Retries (tenacity) wrap only connection / pre-first-token phase.

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
final transcript → Agent.run() → text_delta → SentenceChunker → TTS queue → TTS → outbound queue
                              → tool_started/finished (optional client cue)
```
- **Chunker:** emit on sentence boundaries (guard abbreviations/decimals) + length/time fallback flush; optional short early first chunk. Tracks which sentences were actually delivered (needed for spoken-only history).
- TTS runs as its own task so LLM generation overlaps with speech. Bounded queues for backpressure; never drop audio silently.

### 4.5 Agent loop
- Async generator: build messages (versioned system prompt + trimmed history + user turn) → stream LLM → on tool calls: validate, authorize, execute, append `assistant(tool_calls)` + `tool` results, repeat → else yield final text.
- Limits: max iterations (~4–5), first-token timeout and total LLM timeout, per-tool timeout.
- Failures: tool errors returned to the model as structured results; unrecoverable LLM failure → canned spoken fallback line.
- Context budget: system prompt + last N turns under a token limit; never split a tool call from its result.
- Prompts as versioned files (`prompts/system_v1.md`); version ID logged per `llm_calls` row.

### 4.6 Tool registry
- `Tool` = name, description, Pydantic args model, `required_scope`, `timeout_s`, `has_side_effects`, async `execute(args, ctx)`. LLM JSON schema generated from the Pydantic model.
- Path: lookup → validate args → check scope → run under `asyncio.timeout` → log to `tool_calls`.
- `ctx` carries identity from the JWT (tools never trust model-supplied identity). Per-session `allowed_tools` derived from JWT scopes and filters schemas shown to the model.
- v1: one trivial local tool + one read-only core-api lookup; no side-effect tools.

### 4.7 Persistence
- Tables: `sessions` (user, start/end, end_reason, prompt_version), `turns` (session, seq, role, text, interrupted, spoken_text, timestamps, stage latencies), `tool_calls` (turn, tool, args, result summary, status, duration), `llm_calls` (turn, provider, model, prompt_version, tokens, TTFT, total latency, status).
- Written at turn boundaries by a **background writer task** (off the hot path); DB down ⇒ call continues, warn + bounded retry.
- Repositories in `db/repositories/` own all SQL.

### 4.8 WebSocket protocol (v1, versioned in `start`/`ready`)
- Client → server: `start` (ticket), binary audio, `end`.
- Server → client: `ready` (outbound audio format), `state`, `transcript` (partial/final), `bot_text` (optional), binary audio, `interrupted`, `error`, `ended`.

### 4.9 Layer boundaries
- `api/v1/voice_ws.py`: thin; verify ticket, create `CallSession`, hand over socket.
- `services/`: `call_session.py` (loops + state machine), `session_registry.py` (active sessions, per-user concurrency cap).
- `pipeline/`: `stt/`, `tts/`, `vad/` (each `base.py` + one adapter), `chunker.py`.
- `agent/`: `agent.py`, `llm/base.py` + adapter, `tools/registry.py`, `prompts/`, `context.py`.
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
│   ├── schemas/       # Pydantic models
│   ├── db/            # base, session, models/, repositories/
│   ├── services/      # call_session, session_registry
│   ├── agent/         # loop, llm/, tools/, prompts/, context
│   ├── pipeline/      # stt/, tts/, vad/, chunker
│   └── integrations/  # core-api client, event publishing
├── alembic/
├── tests/
├── .env.example, .gitignore, requirements.txt, README.md
```

## 7. Current State
- Done: venv, packages, folder structure, `alembic init -t async`, `main.py` with `/` and `/health`; **architecture and LLD finalized**.
- Remaining scaffold bits: `.gitignore`, `.env.example`, `core/config.py` (pydantic-settings).
- Next: start coding at build step 1.

## 8. Build Order
1. Text-only agent (LLM event types + provider interface, adapter, streaming, function calling, tool registry, loop) + test harness
2. Session manager, state machine, persistence, migrations
3. TTS out (text in → streamed audio, sentence chunker, 16 kHz resample)
4. STT in + provider-side endpointing → full voice loop with minimal browser test page
5. Barge-in (own VAD + interruption across all stages, spoken-only history)
6. Integration: ticket auth, core-api tool, `call.completed` event
7. Hardening: fallbacks, metrics, concurrent-session load test

## 9. Still Open (decide when reached)
- Provider picks: LLM at step 1; TTS at step 3; STT at step 4
- Exact VAD library and thresholds (step 5)
- Chunker heuristics and early-first-chunk tuning (step 3)