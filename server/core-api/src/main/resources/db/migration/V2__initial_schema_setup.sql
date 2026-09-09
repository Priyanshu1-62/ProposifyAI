CREATE DOMAIN oauth_provider AS VARCHAR(20)
    CONSTRAINT check_provider_name CHECK(VALUE IN ('GOOGLE', 'MICROSOFT', 'GITHUB'));

CREATE DOMAIN llm_generation_status AS VARCHAR(20)
    CONSTRAINT check_generation_status CHECK(VALUE IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'));

CREATE DOMAIN request_status AS VARCHAR(20)
    CONSTRAINT check_request_status CHECK(VALUE IN ('OPEN', 'CLOSED'));

CREATE DOMAIN outbound_email_event AS VARCHAR(20)
    CONSTRAINT check_event_status CHECK(VALUE IN ('QUEUED', 'SENT', 'BOUNCED', 'COMPLAINED', 'DELIVERED', 'FAILED'));

CREATE TABLE app_user (
    id                            UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    email                         TEXT                         NOT NULL UNIQUE,
    display_name                  VARCHAR(100)                 NOT NULL,
    created_at                    TIMESTAMPTZ                  NOT NULL DEFAULT NOW()
);

CREATE TABLE oauth_identity (
    id                            UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                       UUID                         NOT NULL,
    provider                      oauth_provider               NOT NULL,
    provider_user_id              VARCHAR                      NOT NULL,
    created_at                    TIMESTAMPTZ                  NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_user_id
        FOREIGN KEY (user_id)
        REFERENCES app_user(id)
        ON DELETE CASCADE,

    UNIQUE (provider, provider_user_id)
);

CREATE TABLE respondent_group (
    id                             UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id                  UUID                        NOT NULL,
    name                           VARCHAR(100)                NOT NULL,
    created_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    deleted_at                     TIMESTAMPTZ                 NULL,

    CONSTRAINT FK_owner_user_id
        FOREIGN KEY (owner_user_id)
        REFERENCES app_user(id)
        ON DELETE RESTRICT,

    UNIQUE (owner_user_id, name)
);

ALTER TABLE respondent
    ADD COLUMN deleted_at TIMESTAMPTZ NULL,
    ALTER COLUMN group_id TYPE UUID USING group_id::uuid,
    ADD CONSTRAINT FK_group_id
        FOREIGN KEY (group_id)
        REFERENCES respondent_group(id)
        ON DELETE CASCADE;

CREATE TABLE request (
    id                             UUID                          PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id                  UUID                          NOT NULL,
    title                          VARCHAR(100)                  NOT NULL,
    group_id                       UUID                          NOT NULL,
    description_raw                TEXT                          NOT NULL,
    description_summary            TEXT                          NULL,
    summary_status                 llm_generation_status         NOT NULL DEFAULT 'PENDING',
    criteria_status                llm_generation_status         NOT NULL DEFAULT 'PENDING',
    status                         request_status                NOT NULL DEFAULT 'OPEN',
    created_at                     TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),
    closed_at                      TIMESTAMPTZ                   NULL,

    CONSTRAINT FK_owner_user_id
        FOREIGN KEY (owner_user_id)
        REFERENCES app_user(id)
        ON DELETE RESTRICT,

    CONSTRAINT FK_group_id
        FOREIGN KEY (group_id)
        REFERENCES respondent_group(id)
        ON DELETE RESTRICT
);

CREATE TABLE scoring_criterion (
    id                            UUID                           PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id                    UUID                           NOT NULL,
    name                          VARCHAR(100)                   NOT NULL,
    description                   TEXT                           NOT NULL,
    weight                        NUMERIC                        NOT NULL CHECK (weight >= 0 AND weight <=1),
    created_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_id
        FOREIGN KEY (request_id)
        REFERENCES request(id)
        ON DELETE CASCADE
);

CREATE TABLE request_respondent (
    id                            UUID                           PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id                    UUID                           NOT NULL,
    respondent_id                 UUID                           NOT NULL,
    correlation_id                UUID                           NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    email_status                  outbound_email_event           NOT NULL DEFAULT 'QUEUED',
    email_message_id              TEXT                           NULL,
    created_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW(),
    updated_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_id
        FOREIGN KEY (request_id)
        REFERENCES request(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_respondent_id
        FOREIGN KEY (respondent_id)
        REFERENCES respondent(id)
        ON DELETE RESTRICT,

    UNIQUE (request_id, respondent_id)
);

CREATE TABLE email_event (
    id                             UUID                          PRIMARY KEY DEFAULT gen_random_uuid(),
    request_respondent_id          UUID                          NOT NULL,
    provider_event_id              TEXT                          NOT NULL UNIQUE,
    event_type                     outbound_email_event          NOT NULL DEFAULT 'QUEUED',
    payload                        JSONB                         NOT NULL,
    occurred_at                    TIMESTAMPTZ                   NOT NULL,
    received_at                    TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_respondent_id
        FOREIGN KEY (request_respondent_id)
        REFERENCES request_respondent(id)
        ON DELETE CASCADE
);

CREATE TABLE proposal (
    id                             UUID                          PRIMARY KEY DEFAULT gen_random_uuid(),
    request_respondent_id          UUID                          NOT NULL UNIQUE,
    content_raw                    TEXT                          NOT NULL,
    content_summary                TEXT                          NULL,
    summary_status                 llm_generation_status         NOT NULL DEFAULT 'PENDING',
    scoring_status                 llm_generation_status         NOT NULL DEFAULT 'PENDING',
    overall_score                  NUMERIC                       NULL,
    received_at                    TIMESTAMPTZ                   NOT NULL,
    created_at                     TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),
    updated_at                     TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_respondent_id
        FOREIGN KEY (request_respondent_id)
        REFERENCES request_respondent(id)
        ON DELETE CASCADE
);

CREATE TABLE proposal_score (
    id                              UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id                     UUID                         NOT NULL,
    scoring_criterion_id            UUID                         NOT NULL,
    score                           NUMERIC                      NOT NULL CHECK (score >= 0 AND score <= 1),
    reasoning                       TEXT                         NULL,
    created_at                      TIMESTAMPTZ                  NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_proposal_id
        FOREIGN KEY (proposal_id)
        REFERENCES proposal(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_scoring_criterion_id
        FOREIGN KEY (scoring_criterion_id)
        REFERENCES scoring_criterion(id)
        ON DELETE RESTRICT,

    UNIQUE (proposal_id, scoring_criterion_id)
);