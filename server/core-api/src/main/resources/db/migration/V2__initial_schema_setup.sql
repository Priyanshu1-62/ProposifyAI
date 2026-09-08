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
        FOREIGN KEY user_id REFERENCES app_user(id),

    UNIQUE (provider, provider_user_id)
);

CREATE TABLE respondent_group (
    id                             UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id                  UUID                        NOT NULL,
    name                           VARCHAR(100)                NOT NULL,
    created_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_owner_user_id
        FOREIGN KEY owner_user_id REFERENCES app_user(id),

    UNIQUE (owner_user_id, name)
);

ALTER TABLE respondent
    ADD COLUMN deleted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ALTER COLUMN group_id TYPE UUID,
    ADD CONSTRAINT FK_group_id
        FOREIGN KEY group_id REFERENCES respondent_group(id);

CREATE TABLE request (
    id                             UUID                          NOT NULL DEFAULT gen_random_uuid(),
    owner_user_id                  UUID                          NOT NULL,
    title                          VARCHAR(100)                  NOT NULL,
    description_raw                TEXT                          NOT NULL,
    description_summary            TEXT                          NULL,
    summary_status                 llm_generation_status         NOT NULL DEFAULT 'PENDING',
    criteria_status                llm_generation_status         NOT NULL DEFAULT 'PENDING',
    status                         request_status                NOT NULL DEFAULT 'OPEN',
    created_at                     TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),
    closed_at                      TIMESTAMPTZ                   NULL,

    CONSTRAINT FK_owner_user_id
        FOREIGN KEY owner_user_id REFERENCES app_user(id),

    CONSTRAINT FK_group_id
        FOREIGN KEY group_id REFERENCES respondent_group(id)
);

CREATE TABLE scoring_criterion (
    id                            UUID                           PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id                    UUID                           NOT NULL,
    name                          VARCHAR(100)                   NOT NULL,
    description                   TEXT                           NOT NULL,
    weight                        NUMERIC                        NULL CHECK (weight >= 0 AND weight <=1),
    created_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW()
);

CREATE TABLE request_respondent (
    id                            UUID                           PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id                    UUID                           NOT NULL,
    respondent_id                 UUID                           NOT NULL,
    email_status                  outbound_email_event           NOT NULL DEFAULT 'QUEUED',
    email_message_id              TEXT                           NULL,
    created_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW(),
    updated_at                    TIMESTAMPTZ                    NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_id
        FOREIGN KEY request_id REFERENCES request(id),

    CONSTRAINT FK_respondent_id
        FOREIGN KEY respondent_id REFERENCES respondent(id),

    UNIQUE (request_id, respondent_id)
);

CREATE TABLE email_event (
    id                             UUID                          PRIMARY KEY DEFAULT NOW(),
    request_respondent_id          UUID                          NOT NULL UNIQUE,
    event_type                     outbound_email_event          NOT NULL DEFAULT 'QUEUED',
    payload                        JSONB                         NOT NULL,
    occurred_at                    TIMESTAMPTZ                   NOT NULL,
    received_At                    TIMESTAMPTZ                   NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_request_respondent_id
        FOREIGN KEY request_respondent_id REFERENCES request_respondent(id)
);

CREATE TABLE proposal (
    id                             UUID                          PRIMARY KEY DEFALUT NOW(),
    request_respondent_id          UUID                          NOT NULL,
    content_raw                    TEXT                          NULL,
    content_summary                TEXT                          NULL,
    scoring_status
);

