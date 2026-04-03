## Project Overview

- Name: ProposifyAI
- Type: AI-powered RFP management system
- Goal: Automate RFP lifecycle, vendor administration, email workflow management, and automated proposal evaluation

## Architecture

Frontend:
- React + TypeScript + Redux Toolkit + Tailwind CSS

Backend:
- Node.js + Express + TypeScript

Database:
- PostgreSQL (relational)

External Services:
- Resend (Outbound emailing)
- Mailgun (Inbound emailing)
- LLM APIs

## Key Design Decisions

- Backend-first architecture
- Modular file structure
- Strict TypeScript typing across services
- Idempotent webhook + email processing
- Event-driven and fault-tolerant pipeline design
- AI transforms natural language → structured RFP schema
- Add a custom property `userId` to the Express Request object in TypeScript using Declaration Merging
- Segregate backend functioning into request pipeline, outbound pipeline, webhook pipeline, inbound pipeline, AI pipeline. Each pipeline should be atomic, normalized, and independently queriable and scalable (Command Query Responsibility Segregation (CQRS))
- Prompt Seeding System
- Multi-leaf TS config structure
- Structured, pipeline-aware, content-rich logger with distinct levels
- OAuth 2.0 for authentication. Google JWT signature verification against Client ID
- Stateless JWT based shortlived access token + Stateful opaque HTTP-cookie based refresh token for authorization
- Tackle Server's periodic inactivity for smooth OAuth flow

## Database Design and Modelling

- Normalization
- Constraints + Relations
- Single Source of Truth
- Indexing and design based on query patterns
- Enum enforced state consistency and normalization for deterministic UI and pipeline state

## Services / API

- Express Validators/Sanitizers + DB-level constraints to handle race condition
- Request pipeline accepts description in natural language. Then summarize it and then extracts scoring criteria using AI and stores normalized data.
- Outbound, webhook, and inbound email pipelines handles stateful email lifecycle and store atomic data.
- Messy proposal by vendors (free-form text, tables, etc) are summarized and evaluated against the request's scoring criteria. Scoring evaluation is normalized and stored in database for ease for comparision between vendors.
- Track state transition of lifecycles. 
- Maintaina a request overview table for observability and analytics.

## Client

- Controlled Form mangement
- CSS Grid + auto-fill/fit + minmax()
- Nearest parent state lifting
- Redux Toolkit for state management
- Alerts and Spinners for enhancing perceived responsiveness

## Email Workflow

- Normalized email events
- Terminal vs non-terminal email event management
- Stable identifier for each email w.r.t request ID
- Signature verification (timeStamp tolerance based verification)
- Handle idempotency (system retries), resubmissions (human retries, business rule), failure
- Concurrent tasks using Promise.all()

## AI pipeline Orchestration

- AI semantics evaluation system using recursive functions (Validation, Coercion, Normalization) to produce evaluable, Type-safe, and explanable outputs for downstream consumption
- Measure confidence with each LLM response

## Prompt Engineering

- Versioned prompt contracts and controlled prompt construction
- Use pre-defined system prompt and user prompt templates along with prompt builder to inject input data into templates
- Handle Temperature, token budgeting, latency, retries, timeouts
- TCREI framework for prompting. Target hallucinations, idea invention, accidental behavioral change, forbid creativity if necessary Impose deterministic and neutral behaviour, unambiguous and atomic scoring criteria creation. Forced output validation w.r.t provided schema example

## Data Flow

1. User submits RFP description (natural language)
2. Request pipeline:
   - Summarization (AI)
   - Criteria extraction (AI)
   - Normalization and storage
3. Outbound pipeline:
   - Emails sent to vendors
3. Outbound Webhook pipeline:
   - Emails status and data is updated using normalized email event states
4. Inbound pipeline:
   - Vendor responses received and processed
5. AI evaluation pipeline:
   - Proposals evaluated against scoring criteria
6. Results stored and exposed to frontend

## Future Improvements

- Add caching layer (Redis)
- Improve AI confidence scoring calibration
- Add rate limiting and abuse protection

## Recent Changes

- Add Server-wakeUp feature to ensure smooth OAuth workflow

## Known Issues

- UI Dashboard is incomplete


## Work in progress

- Working on heading bar for Auth Page