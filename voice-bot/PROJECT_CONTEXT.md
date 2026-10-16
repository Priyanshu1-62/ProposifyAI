# ProposifyAI — Voice Service: Project Context

## 1. Overview
- ProposifyAI (RFP management) is being rebuilt from Express.js into a Spring Boot backend (`server/`: core-api + workers).
- This document covers the **voice-bot**: an independent, agentic, end-to-end AI voice bot.
- Goal is learning to own such a product at company grade: keep it **minimal but scalable**, add features one at a time.
- **Out of scope for now:** RAG (added later as a tool/helper function).

## 2. Stack and Decisions
| Area | Decision |
|---|---|
| Framework | FastAPI (async), Pydantic (validation), SQLAlchemy async + asyncpg, Alembic |
| Supporting libs | httpx, pyjwt, structlog, tenacity, pytest, pytest-asyncio, ruff |
| Providers | **Provider-agnostic**: STT, TTS, LLM each behind an interface; one provider per slot initially |
| Pipeline style | Cascaded (STT → LLM → TTS), not speech-to-speech |
| Database | Own Postgres DB; no shared tables with core-api |
| Live session state | In memory in the process holding the WebSocket; Redis only when scaling to multiple instances |
| Transport | Browser WebSocket: binary audio frames (PCM16, 16 kHz mono) + JSON control frames |

## 3. System Architecture
- **Frontend** calls core-api (dashboard) and voice-bot (voice component) via an **API gateway** routing by path (`/api/*` → core-api, `/voice/*` → voice-bot). The audio WebSocket connects directly to voice-bot.
- **Auth:** core-api issues a short-lived, narrow-scope session ticket (JWT, asymmetric signing). voice-bot only verifies it.
- **Service interaction:** REST/gRPC for synchronous calls (e.g. core-api lookups), events (Kafka) for aftermath (`call.completed`).
- **Contracts** (explicit, language-neutral, no shared code or DB):
  - REST: auto-generated OpenAPI (FastAPI / springdoc).
  - Events: JSON Schema in `contracts/events/` (versioned); possibly Avro + schema registry later.
  - Auth: `contracts/auth/jwt-claims.md`.

```
Mic ─▶ [WebSocket] ─▶ VAD/endpointing ─▶ STT (stream) ─▶ Session Manager
                                                              │
                                              Agent (loop ⇄ LLM ⇄ tools)
                                                              │ token stream
Speaker ◀─ [WebSocket] ◀─ TTS (stream) ◀─ Sentence chunker ◀──┘
```

**Core principles**
- Pipeline of concurrent async tasks connected by queues; every stage streams and overlaps.
- **Interruption = cancellation:** cancel LLM + TTS tasks, flush outbound audio, notify client, return to LISTENING. Every stage must be cancellable.
- Latency target (design goal): ~1s from end of speech to first audio.

## 4. Components
- **Session Manager:** per-call state machine `LISTENING → THINKING → SPEAKING → (INTERRUPTED) → LISTENING → ENDED`. Holds session/chat ID, history, current turn, allowed tools, task cancellation handles. Persists transcript at turn boundaries.
- **Agent:** loop = build context → call model (streaming) → on tool call: validate args, check permission, execute with timeout, append result, repeat → else stream final answer. Hard iteration cap. LLM behind a provider-agnostic interface.
- **Tools:** registry; each tool has name, Pydantic arg schema, permission scope, timeout, side-effect flag. v1: one trivial local tool + one read-only core-api lookup. No side-effect tools in v1.
- **LLM interaction modes to learn:** plain completion, streaming, function/tool calling, structured output.
- **Persistence tables:** `sessions`, `turns`, `tool_calls` (audit), `llm_calls` (model, prompt version, tokens, latency).

## 5. Features: Now vs Later
**Now:** streaming at every stage; interruption handling; per-stage timeouts; retries with exponential backoff + jitter (only before first token emitted); agent iteration cap; tool arg validation and permissions; prompt versioning (versioned files, version ID logged per turn); structured logging with per-stage latency; simple token/context budget (sliding window); per-user session concurrency cap; usage logging.

**Next:** fallback model / model switching; per-user cost limits; circuit breaker; history summarization.

**Later:** caching (provider prompt caching first); Redis for multi-instance; eval harness; load testing.

**With RAG:** source citation, hallucination handling, confidence scoring.

## 6. Repo Layout
```
proposifyai/
├── server/          # Spring Boot (core-api, workers)
├── voice-bot/   # FastAPI
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
│   ├── services/      # business logic
│   ├── agent/         # loop, tools, prompts
│   ├── pipeline/      # stt, tts, vad
│   └── integrations/  # core-api client, event publishing
├── alembic/
├── tests/
├── .env.example, .gitignore, requirements.txt, README.md
```

## 7. Current State
- Done: venv, packages, folder structure, `alembic init -t async`, `main.py` with `/` and `/health`.
- Remaining scaffold bits: `.gitignore`, `.env.example`, `core/config.py` (pydantic-settings).
- Next: architecture finalized; **LLD in next chat**.

## 8. Build Order
1. Text-only agent (LLM adapter, streaming, function calling, tool registry, loop) + test harness
2. Session manager, state machine, persistence, migrations
3. TTS out (text in → streamed audio, sentence chunker)
4. STT in + endpointing → full voice loop with minimal browser test page
5. Barge-in (interruption across all stages)
6. Integration: ticket auth, core-api tool, `call.completed` event
7. Hardening: fallbacks, metrics, concurrent-session load test

## 9. To Settle in LLD
- Provider picks (STT, TTS, LLM) and interface shapes
- Audio format and frame size
- Endpointing strategy (provider-side vs own VAD)
- State machine transitions and cancellation mechanism (asyncio task groups)
- Class/interface boundaries for the scaffolded layout
