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
- **FK `respondent.group_id` → `respondent_group`**: deferred, table doesn't exist yet. `group_id` is bare TEXT, no referential integrity. TODO once table exists.

---

## 4. Key learnings & gotchas

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

## 5. Current status

- ✅ Parent POM, `common`, `core-api`, `workers/email-worker` scaffolded
- ✅ `core-api` boots on `:8080` against live Supabase via Hikari
- ✅ `V1__init.sql` applied — `respondent` table + 3 status domains
- ✅ `Respondent` entity + 3 status enums — `ddl-auto: validate` passes clean
- ✅ `RespondentRepository` — `extends JpaRepository<Respondent, UUID>`, `findByGroupId`. Unbounded `List` return — revisit with `Pageable` later.
- ✅ `HealthController` — `GET /api/health`, returns `{status, date}`. Deliberately dependency-free (no DB/Kafka check) — avoids cold-start hang if Supabase is also asleep. Note: uses `LocalDate` currently; consider `OffsetDateTime` for actual wake-up timestamp/latency visibility.
- ✅ `SecurityConfig` created — first security config in project. `SecurityFilterChain` bean: `/api/health/**` → `permitAll()`, everything else → `authenticated()`. CSRF and session management left at default (stateful) — revisit together when OAuth2 login is wired in.
- ✅ Verified: `/api/health` returns 200, other paths return 403 (no auth mechanism registered yet)
- `workers/email-worker` — pom scaffolded, not yet run/tested
- `infra/docker-compose.yml` — needs 2nd internal Kafka listener (`kafka:29092`) for container-to-container resolution — not yet fixed
- No `jjwt` dependency yet
- `mapstruct`, `springdoc-openapi` — planned, not added
- FK `group_id` → `respondent_group` — deferred (see §3)

---

## 6. Completed tasks (chronological)

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

---

## 7. Next steps (in order)

1. Fix docker-compose Kafka listener (internal listener for container-to-container, e.g. kafka-ui)
2. Get `email-worker` booting standalone — watch for same Boot 4 per-feature-autoconfig gotcha with Kafka
3. Wire OAuth2 login (`oauth2Login()` in `SecurityConfig`) — then revisit CSRF (disable) + session management (stateless) together
4. Add `jjwt`, mint app JWT after OAuth2 login success
5. Health-check-before-OAuth-call pattern for free-tier cold starts: ping `/api/health` first to wake server, then start OAuth flow — implement once OAuth wiring begins
