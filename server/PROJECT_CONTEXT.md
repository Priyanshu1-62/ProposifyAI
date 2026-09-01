# Proposify AI — Server Rebuild: Project Context

## 1. What this project is

Proposify AI — an RFP (request-for-proposal) management system: email
workflow, webhook handling, bulk email sending, automated response
evaluation. Originally built with an Express.js backend; currently being
rebuilt in Spring Boot as a learning project (Spring Boot + async
programming + microservice-style architecture), **not** a 1:1 language
port — aiming for production-grade structure.

**Approach for this rebuild:** the user is scaffolding and writing the
code themselves to actually learn it. LLM's role is to explain *why*
(dependency choices, config, architecture trade-offs), point out
bugs/misconfigurations and explain the reasoning, and answer questions —
**not** to generate files/code directly, unless explicitly asked for a
one-off deliverable (like this file).

---

## 2. Repo layout

```
ProposifyAI/
  client/              React + Redux Toolkit (existing, untouched so far)
  server/
    pom.xml            parent aggregator (packaging=pom), imports Spring Boot BOM
    common/             shared library module (DTOs/event contracts), no Spring deps
    core-api/           public REST API
    workers/
      email-worker/     independent, scalable Spring Boot worker
    .env               local Supabase/Kafka/OAuth secrets (not committed)
  infra/
    docker-compose.yml  Kafka (KRaft), kafka-ui, mailpit — no db service (using Supabase cloud)
```

- Build tool: **Maven**, multi-module. Each worker is independently
  buildable/deployable: `mvn -pl workers/email-worker -am package`.
- groupId across all modules: `com.proposifyai`
- Java: **25** (LTS). Set via `maven.compiler.release` (not
  `java.version` — that property only works if extending
  `spring-boot-starter-parent`, which we don't; own parent + BOM import
  instead).
- Spring Boot: **4.1.1** (Spring Framework 7).
- Config format: **YAML** (`application.yml`) over `.properties` —
  nested config (oauth2 registration, kafka, datasource) reads better
  indented; YAML supports multi-profile docs in one file.

---

## 3. Architecture decisions (with reasoning)

- **core-api = blocking Spring MVC + virtual threads**, not WebFlux.
  core-api's job is thin — validate → persist → publish to Kafka →
  return. Not high-fanout I/O. Spring Security's OAuth2 login
  (redirects/sessions) is far more mature on the servlet stack than
  reactive. Virtual threads (Java 21+) give scalability without taking
  on reactive complexity where it isn't needed.
- **email-worker = hybrid**: blocking `@KafkaListener` (simple,
  well-understood offset/ack semantics) hands the recipient batch to a
  **reactive WebClient pipeline** (`Flux.fromIterable(...).flatMap(...,
  concurrency)`) for the actual concurrent send. WebFlux starter is
  pulled in *purely* for WebClient/Reactor types — no inbound reactive
  web server on this service.
    - Alternative considered and deferred: fully reactive end-to-end via
      `reactor-kafka`. More complex offset/ack story; revisit if the
      hybrid approach becomes a bottleneck.
    - Resilience4j (rate-limiter + retry) wraps outbound email-provider
      calls — providers cap requests/sec, and a bulk send is exactly the
      kind of burst that hits that cap.
- **common module stays framework-light.** No `spring-boot-starter-*`
  in it (deliberately removed early on) — plain library jar (Kafka
  event DTOs, shared exceptions), not a runnable Spring app. Anything
  added to its classpath leaks into every dependent module, so keep it
  minimal.
- **OAuth2 role in core-api: OAuth2 Client (social login).** Google/
  Microsoft login via `spring-boot-starter-oauth2-client`, then
  core-api mints its **own** app JWT (via `jjwt`, not yet added to pom)
  after successful login — that's the token the React/Redux client
  actually uses afterward. (Not resource-server-only, not a full
  Authorization Server issuing tokens to third parties.)
- **Database: Supabase (cloud Postgres)**, session pooler URL. No local
  Postgres container in docker-compose — deliberately dropped since
  Supabase is used from day one.
- **Kafka locally: KRaft mode**, single container, no Zookeeper.
- **`ddl-auto: validate`** (not `update`) — schema is owned by Flyway
  migrations only; Hibernate just checks entities match, never mutates
  schema itself.
- **.env lives in `core-api/`** (not repo root, not `server/`) — scoped
  to the module that actually reads it.
- **Enums stored as `VARCHAR` + `CHECK` via `CREATE DOMAIN`**, not
  native Postgres `ENUM` types. Native enums are painful to evolve
  (`ALTER TYPE ... ADD VALUE` has transaction-block restrictions,
  values can't be removed without recreating the type) and need extra
  Hibernate ceremony to map. Domains map to plain
  `@Enumerated(EnumType.STRING)` with zero custom type handling, and
  are trivially evolved via a normal `ALTER TABLE ... DROP/ADD
  CONSTRAINT` migration.
- **FK from `respondent.group_id` to `respondent_group` deferred.**
  `respondent_group` table doesn't exist yet, so `group_id` is
  currently a bare `TEXT` column with no referential integrity.
  **TODO:** add FK constraint via migration once `respondent_group`
  exists — currently orphaned `group_id` values are possible and
  silently allowed.

---

## 4. Key learnings & gotchas

Mistakes caught during scaffolding/debugging — read before repeating
them in a new module (e.g. email-worker):

**Maven / POM**
- Parent POM `<packaging>` must be `pom`, not `jar`.
- Spring Boot BOM must be explicitly imported in the parent (no
  `spring-boot-starter-parent` in use).
- Correct starter artifact IDs: `spring-boot-starter-web`,
  `spring-boot-starter-kafka` (not `*-webmvc`, `*-flyway`,
  `*-oauth2-client`, and no `*-test` suffix variants).
- Child POMs need the correct `relativePath` depth and must include
  `<parent><version>`.
- Without `spring-boot-starter-parent`, `java.version` property does
  nothing — use `maven.compiler.release`.

**Spring Boot 4.x specifically**
- Boot 4 split the old monolithic `spring-boot-autoconfigure.jar` into
  **per-feature autoconfiguration modules**. Having `flyway-core` (the
  actual Flyway library) on the classpath is **not** enough — Boot
  also needs its own `spring-boot-flyway` module to know to
  autoconfigure it. Symptom when missing: complete silence, zero
  Flyway log lines, no error — looks like the migration file is being
  ignored when actually `FlywayAutoConfiguration` never loads at all.
  **Expect this same pattern with other features** (Kafka, etc.) —
  check for an equivalent per-feature module before assuming a config
  problem.
- `spring-dotenv` silently fails with Spring Boot 4's autoconfiguration
  chain, surfacing as a misleading `'url' must start with "jdbc"`
  error — correct artifact is `me.paulschwarz:springboot4-dotenv`.

**Flyway**
- "Found non-empty schema(s) but no schema history table" means
  Flyway found existing objects in `public` (tables/domains/etc.) with
  no `flyway_schema_history` bookkeeping table to explain them. Two
  fixes depending on cause: `spring.flyway.baseline-on-migrate: true`
  if the pre-existing objects are legitimate and should be kept
  as-is; or manually drop everything in `public` and let Flyway build
  fresh if (like here) they're stale leftovers you don't need. Watch
  for leftover **domains/enums/sequences/functions**, not just
  tables — those don't always show up clearly in a dashboard's table
  view.
- IDE "Typo: In word 'X'" warnings on things like `TIMESTAMPTZ` are
  the editor's natural-language spell-checker, not a SQL error —
  cosmetic, safe to ignore or add to a custom dictionary.

**Postgres SQL**
- `CREATE DOMAIN name AS type ...` — the `AS` keyword is required;
  easy to drop by analogy with `CREATE TYPE`.
- Use `TIMESTAMPTZ`, not bare `TIMESTAMP`, for any created/updated
  timestamp column — avoids timezone ambiguity across environments.
- `gen_random_uuid()` works on Supabase's Postgres 13+ without needing
  to enable `pgcrypto` explicitly.
- Keep all identifiers **explicit snake_case** (`group_id`,
  `created_at`) — unquoted mixed-case identifiers get silently folded
  to lowercase by Postgres, which then mismatches Hibernate's default
  naming strategy (which expects snake_case columns for camelCase
  Java fields).

**JPA / Hibernate**
- UUID primary key with a DB-side `DEFAULT gen_random_uuid()`: use
  `@UuidGenerator` (Hibernate-side generation), not
  `@GeneratedValue(strategy = GenerationType.IDENTITY)` — `IDENTITY`
  is designed around auto-increment integer columns, not UUID defaults.
- `@Enumerated(EnumType.STRING)` must be explicit on every enum field.
  Without it, Hibernate defaults to `EnumType.ORDINAL` (stores an
  integer index) — silently wrong against a `VARCHAR`-backed domain
  column expecting string values like `'PENDING'`.
- An explicit `@Column(name = "...")` is taken **literally** — no
  naming-strategy folding applied on top of it. A typo there (e.g.
  matching a domain's type name instead of the actual column name)
  won't get corrected automatically and will fail `ddl-auto: validate`.
- For `TIMESTAMPTZ` columns, map to `java.time.OffsetDateTime` (or
  `Instant`), not legacy `java.util.Date` — proper timezone handling.
- `ddl-auto: validate` checks column existence, types, length, and
  nullability against the live schema — it does *not* require
  table-level constraints (like `UNIQUE`) to be mirrored in
  annotations to pass. Adding them anyway is good self-documentation
  and matters if `ddl-auto: create` is ever used for tests.

---

## 5. Current status

- ✅ `server/pom.xml` parent — packaging=pom, imports Spring Boot 4.1
  BOM, `<modules>` lists core-api, common, workers/email-worker.
- ✅ `common` — scaffolded, builds. One shared record
  (`BulkEmailRequestedEvent` — proposalId, recipients, etc.) sketched
  during planning but **not yet actually added to the module** — check
  before assuming it exists.
- ✅ `core-api` — scaffolded and **boots successfully** on `:8080`
  against live Supabase Postgres via Hikari. Dependencies in place:
  Web, Validation, Security, OAuth2 Client, Data JPA, PostgreSQL
  driver, Flyway (+ flyway-database-postgresql + **spring-boot-flyway**),
  spring-kafka, Actuator, Lombok. OAuth2 Google credentials added to
  `.env`.
- ✅ First Flyway migration (`V1__init.sql`) applied cleanly against a
  wiped Supabase `public` schema — creates the `respondent` table plus
  three status domains (`outbound_email_status`, `inbound_email_status`,
  `inbound_evaluation_status`).
- ✅ `Respondent` `@Entity` + three status enums
  (`OutboundEmailStatus`, `InboundEmailStatus`,
  `InboundEvaluationStatus`) written under
  `core-api/.../respondent/{model,constant}`. `ddl-auto: validate`
  passes clean against the live schema.
- ⬜ **Spring Data repository for `Respondent` not yet written** — the
  original step 2 target ("`@Entity` + repository") is only half done.
  Do this before moving to step 3.
- ✅ `workers/email-worker` — pom scaffolded (WebFlux, spring-kafka,
  Actuator, Lombok). **Not yet run/tested.**
- ✅ `infra/docker-compose.yml` — kafka (KRaft), kafka-ui, mailpit.
  Known gap: needs a second internal Kafka listener (advertised as
  `kafka:29092`) so kafka-ui and other containers can resolve the
  broker correctly — single-listener config only works for
  host-machine clients (`localhost:9092`), not container-to-container.
  **Not yet fixed in the actual file.**
- ⬜ No controllers yet.
- ⬜ `jjwt` not yet added to core-api's pom (needed for minting the app
  JWT after OAuth2 login succeeds).
- ⬜ `mapstruct`, `springdoc-openapi` — planned, not yet added.
- ⬜ FK from `respondent.group_id` → `respondent_group` — deferred
  until `respondent_group` table exists (see §3).

---

## 6. Completed tasks (chronological)

1. Scaffolded `server/pom.xml` parent aggregator + `common`,
   `core-api`, `workers/email-worker` modules; resolved multiple Maven
   misconfigurations (packaging, BOM import, artifact IDs,
   `relativePath`, `maven.compiler.release`).
2. Got `core-api` booting successfully against live Supabase Postgres
   (Hikari connected). Fixed the `spring-dotenv` → `springboot4-dotenv`
   swap after a misleading JDBC URL error.
3. Copied Maven wrapper files from `core-api/` up to `server/` to
   enable multi-module `-pl` commands.
4. Designed and wrote `V1__init.sql`: `respondent` table with UUID PK
   (`gen_random_uuid()` default), three enum-backed status columns via
   `CREATE DOMAIN ... AS VARCHAR ... CHECK (...)`, unique
   `(email, group_id)` constraint, FK to `respondent_group`
   deliberately deferred.
5. Debugged Flyway running completely silently on boot — root cause:
   Spring Boot 4's split of autoconfiguration into per-feature
   modules; fixed by adding `spring-boot-flyway` alongside
   `flyway-core`.
6. Debugged Flyway's "non-empty schema but no history table" error —
   traced to stale leftover schema objects from the original
   Express/Prisma-era database. Decided to wipe `public` entirely
   (no real data at stake) and let Flyway build fresh from `V1`.
7. Confirmed `V1__init.sql` applies cleanly against a wiped schema;
   `flyway_schema_history` created correctly.
8. Wrote `Respondent` `@Entity` and three status enums under
   `respondent/{model,constant}`. Iterated through several real bugs
   (missing `@Enumerated(EnumType.STRING)`, wrong ID generation
   strategy, `@Column(name=...)` typos pointing at domain names
   instead of column names, `Date` vs `OffsetDateTime`, `email`
   type mismatch after switching the DB column from `VARCHAR(100)` to
   `TEXT`) before `ddl-auto: validate` passed clean on boot.

---

## 7. Next steps (in order)

1. **Finish step 2**: write the Spring Data JPA repository interface
   for `Respondent` (e.g. `RespondentRepository extends
   JpaRepository<Respondent, UUID>`) — the entity alone doesn't
   complete this step.
2. One trivial unauthenticated `@RestController` (e.g. a health-ish
   endpoint) — prove MVC works end-to-end *before* layering OAuth2
   security rules on top, so a plain 200 is visible first and can be
   watched correctly becoming a 401/redirect once security's added.
3. Fix the docker-compose Kafka listener (internal listener for
   container-to-container, e.g. kafka-ui).
4. Get `email-worker` booting standalone (currently untested) — watch
   for the same Boot 4 per-feature-autoconfiguration-module gotcha
   with Kafka.
