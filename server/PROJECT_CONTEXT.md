# Proposify AI — Server Context

Living doc. Update it as we go so a new chat (or future-you) can pick up
without re-explaining everything. Keep it lean — enough to paint the
picture, not a full changelog.

## What this project is

Proposify AI — an RFP (request-for-proposal) management system: email
workflow, webhook handling, bulk email sending, automated response
evaluation. Originally built with an Express.js backend; currently being
rebuilt in Spring Boot as a learning project (Spring Boot + async
programming + microservice-style architecture), **not** a 1:1 language
port — aiming for production-grade structure.

**Approach for this rebuild:** the user is scaffolding and writing the
code themselves to actually learn it. Claude's role is to explain
*why* (dependency choices, config, architecture trade-offs), point out
bugs/misconfigurations and explain the reasoning, and answer questions —
**not** to generate files/code directly, unless explicitly asked for a
one-off deliverable (like this file).

## Repo layout

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
  `java.version` — that property only works if you extend
  `spring-boot-starter-parent`, which we don't; we use our own parent +
  import the BOM instead).
- Spring Boot: **4.1.1** (Spring Framework 7).
- Config format: **YAML** (`application.yml`) over `.properties` —
  nested config (oauth2 registration, kafka, datasource) reads much
  better indented, and YAML supports multi-profile docs in one file.

## Key architecture decisions (with reasoning)

- **core-api = blocking Spring MVC + virtual threads**, not WebFlux.
  Reasoning: core-api's job is thin — validate → persist → publish to
  Kafka → return. Not high-fanout I/O. Spring Security's OAuth2 login
  (redirects/sessions) is far more mature on the servlet stack than
  reactive. Virtual threads (Java 21+) give scalability without taking
  on reactive complexity where it isn't needed.
- **email-worker = hybrid**: blocking `@KafkaListener` (simple,
  well-understood offset/ack semantics) that hands the recipient batch
  to a **reactive WebClient pipeline** (`Flux.fromIterable(...).flatMap(...,
  concurrency)`) for the actual concurrent send. WebFlux starter is
  pulled in *purely* for WebClient/Reactor types — there's no inbound
  reactive web server on this service.
  - Alternative considered and deferred: fully reactive end-to-end via
    `reactor-kafka`. More complex offset/ack story; revisit if the
    hybrid approach becomes a bottleneck.
  - Resilience4j (rate-limiter + retry) wraps the outbound email-provider
    calls — providers cap requests/sec, and a bulk send is exactly the
    kind of burst that will hit that cap.
- **common module stays framework-light.** No `spring-boot-starter-*` in
  it (deliberately removed early on) — it's a plain library jar
  (Kafka event DTOs, shared exceptions), not a runnable Spring app.
  Anything added to its classpath leaks into every module that depends
  on it, so keep it minimal.
- **OAuth2 role in core-api: OAuth2 Client (social login).** Google/
  Microsoft login via `spring-boot-starter-oauth2-client`, then core-api
  mints its **own** app JWT (via `jjwt`, not yet added to pom) after
  successful login — that's the token the React/Redux client actually
  uses afterward. (Not a resource-server-only setup, not a full
  Authorization Server issuing tokens to third parties.)
- **Database: Supabase (cloud Postgres)**, session pooler URL. No local
  Postgres container in docker-compose — deliberately dropped since
  Supabase is used from day one.
- **Kafka locally: KRaft mode**, single container, no Zookeeper.
- **`ddl-auto: validate`** (not `update`) — schema is owned by Flyway
  migrations only; Hibernate just checks entities match, never mutates
  schema itself.
- **.env lives in `core-api/`** (not repo root, not `server/`) — scoped
  to the module that actually reads it. Loaded via
  `me.paulschwarz:springboot4-dotenv` (the Boot-4-specific artifact —
  the generic `spring-dotenv` artifact does NOT auto-integrate with
  Boot 4 and silently no-ops; this cost real debugging time, don't
  repeat the mistake in email-worker's .env setup later).

## Status as of 2026-08-23

- ✅ `server/pom.xml` parent — packaging=pom, imports Spring Boot 4.1
  BOM, `<modules>` lists core-api, common, workers/email-worker.
- ✅ `common` — scaffolded, builds, one shared record
  (`BulkEmailRequestedEvent` — proposalId, recipients, etc.) sketched
  during planning but **not yet actually added to the module** — check
  before assuming it exists.
- ✅ `core-api` — scaffolded and **boots successfully** on `:8080`
  against live Supabase Postgres via Hikari. Dependencies in place: Web,
  Validation, Security, OAuth2 Client, Data JPA, PostgreSQL driver,
  Flyway (+ flyway-database-postgresql), spring-kafka, Actuator,
  Lombok. OAuth2 Google credentials added to `.env`.
- ✅ `workers/email-worker` — pom scaffolded (WebFlux, spring-kafka,
  Actuator, Lombok). **Not yet run/tested.**
- ✅ `infra/docker-compose.yml` — kafka (KRaft), kafka-ui, mailpit.
  Known gap: needs a second internal Kafka listener (advertised as
  `kafka:29092`) so kafka-ui and other containers can resolve the
  broker correctly — single-listener config only works for host-machine
  clients (`localhost:9092`), not container-to-container. **Not yet
  fixed in the actual file.**
- ⬜ No Flyway migrations yet (`db/migration` folder doesn't exist).
  Currently silent/harmless since there's nothing to validate against —
  **this will start failing the moment a `@Entity` is added**, because
  Hibernate (`ddl-auto: validate`) will have something to check against
  a schema Flyway never created. Expected, not a bug, when it happens.
- ⬜ No entities, repositories, or controllers yet.
- ⬜ `jjwt` not yet added to core-api's pom (needed for minting the app
  JWT after OAuth2 login succeeds).
- ⬜ `mapstruct`, `springdoc-openapi` — planned, not yet added.

## Next steps (in order)

1. First Flyway migration (`core-api/src/main/resources/db/migration/V1__init.sql`)
   — one table, prove Flyway applies it against Supabase on boot.
2. One `@Entity` + Spring Data repository matching that table — prove
   `ddl-auto: validate` passes against real schema.
3. One trivial unauthenticated `@RestController` (e.g. health-ish
   endpoint) — prove MVC works end-to-end *before* layering OAuth2
   security rules on top, so you can see a plain 200 first and then
   watch it correctly become a 401/redirect once security's added.
4. Fix the docker-compose Kafka listener (internal listener for
   container-to-container, e.g. kafka-ui).
5. Get `email-worker` booting standalone (currently untested).

## Known gotchas hit so far (don't repeat)

- Windows/PowerShell: `mvn` isn't a global command unless Maven's
  installed separately — use the Maven **wrapper** (`mvnw.cmd`) instead.
  Wrapper files (`mvnw`, `mvnw.cmd`, `.mvn/`) were copied from
  `core-api/` up into `server/` so `-pl` commands work from the
  multi-module root.
- Parent `<parent>` block in a child pom **always** needs
  `groupId` + `artifactId` + `version`, even with `relativePath` set —
  omitting `version` breaks the build (`'parent.version' is missing`).
- Spring Boot only wraps multi-library integrations as
  `spring-boot-starter-X`. Single-library integrations (Kafka, Flyway)
  have no starter — add the library directly
  (`org.springframework.kafka:spring-kafka`,
  `org.flywaydb:flyway-core`) and Boot autoconfigures off classpath
  presence.
- `spring-dotenv` vs `springboot4-dotenv`: **use the Boot-version-specific
  artifact.** The generic one doesn't hook into Boot 4's
  autoconfiguration/EnvironmentPostProcessor chain and fails silently
  (no error — placeholders like `${SUPABASE_DB_URL}` just never
  resolve, surfacing as a confusing downstream error like `'url' must
  start with "jdbc"`).
