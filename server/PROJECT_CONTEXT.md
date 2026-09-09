# Proposify AI — Server Rebuild: Project Context

## 1. What this is

RFP management system (email workflow, webhooks, bulk email, response evaluation). Rebuilding Express.js backend into Spring Boot as a learning project — not a 1:1 port, aiming for production-grade structure.

**Working style:** User writes all code themselves. LLM explains reasoning, flags bugs/misconfigs, answers questions. Does not generate files/code unless explicitly asked for a one-off deliverable (like this file).

---

## 2. Repo layout

```
ProposifyAI/
  client/              React + Redux Toolkit (existing, untouched)
  server/
    pom.xml            parent aggregator (packaging=pom), imports Spring Boot BOM
    common/             shared lib (DTOs/event contracts), no Spring deps
    core-api/           public REST API
    workers/
      email-worker/     independent Spring Boot worker
    .env               in core-api/, not committed
  infra/
    docker-compose.yml  Kafka (KRaft), kafka-ui, mailpit — no db (Supabase cloud)
```

- Maven multi-module. groupId: `com.proposifyai`
- Java 25, set via `maven.compiler.release` (no `spring-boot-starter-parent` in use)
- Spring Boot 4.1.1 (Framework 7)
- Config: YAML

---

## 3. Architecture decisions

- **core-api**: blocking MVC + virtual threads (thin validate→persist→publish workload; OAuth2 more mature on servlet stack)
- **email-worker**: blocking `@KafkaListener` → reactive `Flux`/WebClient for concurrent send. WebFlux pulled in only for WebClient/Reactor types, no reactive server. Resilience4j (rate-limit + retry) planned for outbound email calls.
- **common**: framework-light, no Spring starters — anything added leaks to all dependents
- **OAuth2**: Client (social login) only — Google/Microsoft login, then core-api mints its own JWT via `jjwt` (not yet added). Not resource-server/auth-server.
- **DB**: Supabase cloud Postgres, session pooler URL, no local container
- **Kafka**: KRaft mode, no Zookeeper
- **`ddl-auto: validate`** — Flyway owns schema, Hibernate only checks
- **Enums**: `VARCHAR` + `CHECK` via `CREATE DOMAIN`, not native Postgres enums (easier to evolve, maps to plain `@Enumerated(STRING)`)

---

## 4. Data flow (product-level)

1. User creates a `request` (title + natural-language description) against a chosen `respondent_group`.
2. Async: description summarized by LLM → `scoring_criterion` rows generated from summary.
3. Async: emails sent to every respondent in the group → per-invite email status tracked, updated via webhooks.
4. Vendor replies with a proposal (natural language) → summarized → scored against the request's `scoring_criterion` rows → per-criterion breakdown + overall score shown in UI.
5. User closes the request once enough proposals are in.

---

## 5. Low-level DB design (locked in)

### Entities

| Entity | Purpose |
|---|---|
| `app_user` | Owner of groups/requests, authenticated via OAuth2 |
| `oauth_identity` | Per-provider social login identity, 1:N from `app_user` |
| `respondent_group` | Reusable, user-owned named list of respondents |
| `respondent` | Individual vendor contact; belongs to one group; soft-deletable |
| `request` | The RFP; snapshots which group it targeted |
| `scoring_criterion` | LLM-generated evaluation criteria, owned by a `request` |
| `request_respondent` | Join row = one invite; holds email status + correlation token |
| `email_event` | Append-only webhook log per invite (SENT/DELIVERED/BOUNCED/...) |
| `proposal` | Vendor's incoming reply for one invite (1:1, enforced) |
| `proposal_score` | Score + reasoning per (proposal, criterion) pair |

### Key relationships & why

- `request_respondent` is the pivot table: `respondent` is reusable across requests, but email status and proposal are per-request, so they hang off the join row, not off `respondent` directly.
- `request.group_id` is a durable snapshot of "who was targeted" — independent of later edits to `respondent_group` membership.
- `proposal` → `request_respondent` is `UNIQUE`, enforcing **one accepted proposal per invite**; later resubmissions are silently rejected (DB-level guarantee, race-proof).
- `correlation_token` lives on `request_respondent` as its own `UUID NOT NULL UNIQUE` column (not the PK) — needed so it can be rotated independently of row identity if a reply goes unmatched. Used to match inbound vendor replies back to the correct invite regardless of email provider.
- `email_event.provider_event_id` (not `request_respondent_id`) is the idempotency key — a single invite legitimately produces multiple lifecycle events (QUEUED→SENT→DELIVERED), so only the *provider's* per-webhook event ID can dedupe safely.

### FK cascade rules

| Child → Parent | Rule | Why |
|---|---|---|
| `oauth_identity.user_id` → `app_user` | CASCADE | Identity meaningless without user |
| `respondent_group.owner_user_id` → `app_user` | RESTRICT | Never silently drop groups on user delete |
| `respondent.group_id` → `respondent_group` | **CASCADE** | Safe because orphan groups (only ones hard-deleted) have no respondents referenced elsewhere |
| `request.owner_user_id` → `app_user` | RESTRICT | Requests are permanent records |
| `request.group_id` → `respondent_group` | RESTRICT | Safety net; group deletion path never hard-deletes a group referenced by any request anyway |
| `scoring_criterion.request_id` → `request` | CASCADE | Criteria owned wholly by request |
| `request_respondent.request_id` → `request` | CASCADE | Invites owned wholly by request |
| `request_respondent.respondent_id` → `respondent` | RESTRICT | Never hard-delete a respondent with invite history — soft-delete only |
| `email_event.request_respondent_id` → `request_respondent` | CASCADE | Log entries meaningless without invite |
| `proposal.request_respondent_id` → `request_respondent` | CASCADE + UNIQUE | Ownership + one-proposal-per-invite rule |
| `proposal_score.proposal_id` → `proposal` | CASCADE | Scores meaningless without proposal |
| `proposal_score.scoring_criterion_id` → `scoring_criterion` | RESTRICT | Never corrupt existing score breakdowns by deleting a criterion in use |

### Business rules locked in

- **Soft delete**: `respondent.deleted_at` and `respondent_group.deleted_at`, both nullable, no default. `NULL` = active.
- **Group deletion policy** (app-layer, transactional with `SELECT ... FOR UPDATE` row lock on the group to avoid check-then-act races):
    - Linked to any **OPEN** request → deletion rejected; error surfaces the offending request's title.
    - Linked only to **CLOSED** requests → soft-delete (`deleted_at` set). Closed-request historical views still resolve the group name (they don't filter on `deleted_at`); the "pick a group" UI for new requests does filter it.
    - **Orphan** group (no request ever referenced it) → hard `DELETE`, cascades to its `respondent` rows via the `CASCADE` FK above.
- **One proposal per invite**: enforced via `UNIQUE(request_respondent_id)` on `proposal`; late/duplicate submissions rejected silently, no app-level dedup logic needed.
- **Webhook idempotency**: enforced via `UNIQUE(provider_event_id)` on `email_event`; duplicate webhook deliveries fail the insert.
- **Enums via `CREATE DOMAIN`**: `oauth_provider`, `llm_generation_status` (PENDING/PROCESSING/COMPLETED/FAILED — shared across summary/criteria/scoring statuses), `request_status` (OPEN/CLOSED), `outbound_email_event` (QUEUED/SENT/BOUNCED/COMPLAINED/DELIVERED/FAILED).

### Open items from LLD (not yet decided)

- Whether `scoring_criterion` needs a `sort_order` column for stable UI display ordering — deferred, not yet added.
- `scoring_criterion.weight` currently `NOT NULL` — confirmed intentional (no "equal weighting by omission" path).
- `proposal.content_raw` / `received_at` nullability — left nullable in migration; revisit if a placeholder-row-before-receipt pattern is ever needed.

---

## 6. Key learnings & gotchas

**Maven/POM**
- Parent `<packaging>` must be `pom`
- Boot BOM must be explicitly imported (no starter-parent)
- Correct artifact IDs: `spring-boot-starter-web`, `-kafka` (not `-webmvc`, `-flyway`, `-oauth2-client` variants, no `-test` suffix)
- `java.version` prop does nothing without starter-parent — use `maven.compiler.release`

**Spring Boot 4.x**
- Autoconfigure split into per-feature modules. `flyway-core` alone isn't enough — need `spring-boot-flyway` too, or it fails silently (no logs, no error). Expect same pattern for other features (Kafka etc.) — check for a per-feature module before assuming a config bug.
- `spring-dotenv` silently fails on Boot 4 → misleading `'url' must start with "jdbc"` error. Correct artifact: `me.paulschwarz:springboot4-dotenv`

**Flyway**
- "Non-empty schema, no history table" = stale objects in `public` with no `flyway_schema_history`. Fix: `baseline-on-migrate: true` (keep objects) or wipe schema (stale leftovers). Watch for leftover domains/enums/sequences, not just tables.
- IDE "Typo" warnings on `TIMESTAMPTZ` = spellchecker, not a SQL error

**Postgres SQL**
- `CREATE DOMAIN name AS type ...` — `AS` required
- Use `TIMESTAMPTZ`, not bare `TIMESTAMP`
- `gen_random_uuid()` works on Supabase PG13+ with no extension needed
- Explicit snake_case identifiers — unquoted mixed-case gets folded lowercase, mismatches Hibernate's naming strategy
- `FOREIGN KEY (column)` requires parens around the column name — omitting them is a syntax error, easy to miss across many constraints
- PK/ID defaults must use `gen_random_uuid()`, not `NOW()` — the latter returns a timestamp, not a UUID
- Changing a column's type (e.g. TEXT → UUID) via `ALTER COLUMN ... TYPE` may need an explicit `USING column::uuid` cast

**JPA/Hibernate**
- UUID PK w/ DB-side default → `@UuidGenerator`, not `@GeneratedValue(IDENTITY)`
- `@Enumerated(STRING)` must be explicit or Hibernate defaults to ORDINAL (silently wrong vs VARCHAR domain)
- `@Column(name=...)` is taken literally, no naming-strategy folding — typos not auto-corrected, fail `ddl-auto: validate`
- `TIMESTAMPTZ` → `OffsetDateTime`/`Instant`, not `Date`
- `ddl-auto: validate` checks existence/type/length/nullability only — doesn't require `UNIQUE` etc. mirrored in annotations

**Spring Data repositories**
- Derived query methods (e.g. `findByGroupId`) map to **Java field names**, not DB columns. Validated eagerly at boot — mismatch fails startup, not call site.
- `@Repository` on Spring Data interfaces is not load-bearing (auto-detected via `JpaRepository` extension regardless) — fine as self-documentation only.

**Security**
- `spring-boot-starter-security` on classpath locks down **all** endpoints by default the moment it's present — even a trivial unauthenticated controller needs an explicit `SecurityFilterChain` with `permitAll()`, or it gets caught in the default auth barrier (redirect/401) same as `/actuator/health`.
- With `anyRequest().authenticated()` and no `formLogin()`/`oauth2Login()` configured yet, blocked requests return flat **403**, not a login redirect (no authentication entry point registered yet). Expected until OAuth2 login is wired in.
- CSRF only affects state-changing methods (POST/PUT/PATCH/DELETE) — irrelevant to a GET-only health check either way. Deliberately left enabled for now; disable together with switching to stateless sessions once OAuth2 login + JWT issuance is wired in (CSRF protection is meaningless for stateless bearer-token auth).

---

## 7. Current status

- ✅ Parent POM, `common`, `core-api`, `workers/email-worker` scaffolded
- ✅ `core-api` boots on `:8080` against live Supabase via Hikari
- ✅ `V1__init.sql` applied — `respondent` table + 3 status domains
- ✅ `Respondent` entity + 3 status enums — `ddl-auto: validate` passes clean
- ✅ `RespondentRepository` — `extends JpaRepository<Respondent, UUID>`, `findByGroupId`. Unbounded `List` return — revisit with `Pageable` later.
- ✅ `HealthController` — `GET /api/health`, returns `{status, date}`. Deliberately dependency-free (no DB/Kafka check) — avoids cold-start hang if Supabase is also asleep. Note: uses `LocalDate` currently; consider `OffsetDateTime` for actual wake-up timestamp/latency visibility.
- ✅ `SecurityConfig` created — first security config in project. `SecurityFilterChain` bean: `/api/health/**` → `permitAll()`, everything else → `authenticated()`. CSRF and session management left at default (stateful) — revisit together when OAuth2 login is wired in.
- ✅ Verified: `/api/health` returns 200, other paths return 403 (no auth mechanism registered yet)
- ✅ Full LLD for RFP domain designed — entities, FK rules, soft-delete/group-deletion policy, one-proposal-per-invite, webhook idempotency all locked in (see §5)
- ✅ `V2__initial_schema_setup.sql` written (app_user, oauth_identity, respondent_group, request, scoring_criterion, request_respondent, email_event, proposal, proposal_score + respondent FK/soft-delete retrofit) — reviewed, corrections applied, ready to commit
- `workers/email-worker` — pom scaffolded, not yet run/tested
- `infra/docker-compose.yml` — needs 2nd internal Kafka listener (`kafka:29092`) for container-to-container resolution — not yet fixed
- No `jjwt` dependency yet
- `mapstruct`, `springdoc-openapi` — planned, not added

---

## 8. Completed tasks (chronological)

1. Scaffolded parent + 3 modules; resolved Maven misconfigs (packaging, BOM, artifact IDs, `relativePath`, compiler release)
2. `core-api` boots against Supabase; fixed `spring-dotenv` → `springboot4-dotenv`
3. Copied Maven wrapper up to `server/` for multi-module `-pl` commands
4. Wrote `V1__init.sql`: `respondent` table, UUID PK, 3 enum domains, unique `(email, group_id)`, FK deferred
5. Fixed silent Flyway no-op — added `spring-boot-flyway`
6. Fixed "non-empty schema" error — wiped stale `public` schema from Express/Prisma era
7. Confirmed `V1` applies clean, `flyway_schema_history` created
8. Wrote `Respondent` entity + 3 enums; fixed `@Enumerated(STRING)`, ID gen strategy, `@Column` name typos, `Date`→`OffsetDateTime`, email type mismatch
9. Wrote `RespondentRepository` (`findByGroupId` derived query)
10. Wrote `HealthController` (`GET /api/health`, dependency-free)
11. Wrote `SecurityConfig` — first `SecurityFilterChain`, health permitAll, rest authenticated, CSRF deferred. Verified 200 vs 403 behavior.
12. Designed full RFP domain LLD (entities, FK rules, soft-delete, group deletion policy, idempotency, correlation token strategy) — see §5
13. Wrote `V2__initial_schema_setup.sql` covering full LLD; reviewed and corrected (missing PK/columns, FK paren syntax, typos, soft-delete default bug, idempotency key fix)

---

## 9. Next steps (in order)

1. Apply `V2__initial_schema_setup.sql`, confirm clean Flyway apply against Supabase
2. Write `@Entity` classes + repositories for the new tables (app_user, respondent_group, request, scoring_criterion, request_respondent, email_event, proposal, proposal_score)
3. Fix docker-compose Kafka listener (internal listener for container-to-container, e.g. kafka-ui)
4. Get `email-worker` booting standalone — watch for same Boot 4 per-feature-autoconfig gotcha with Kafka
5. Wire OAuth2 login (`oauth2Login()` in `SecurityConfig`) — then revisit CSRF (disable) + session management (stateless) together
6. Add `jjwt`, mint app JWT after OAuth2 login success
7. Health-check-before-OAuth-call pattern for free-tier cold starts: ping `/api/health` first to wake server, then start OAuth flow — implement once OAuth wiring begins