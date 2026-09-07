CREATE DOMAIN oauth_provider AS VARCHAR
    CONSTRAINT check_provider_name CHECK(VALUE IN ('GOOGLE', 'MICROSOFT', 'GITHUB'));

CREATE TABLE app_user (
    id                            UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    email                         VARCHAR                      NOT NULL UNIQUE,
    display_name                  VARCHAR                      NOT NULL,
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
    name                           VARCHAR                     NOT NULL,
    created_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at                     TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),

    CONSTRAINT FK_owner_user_id
        FOREIGN KEY owner_user_id REFERENCES app_user(id),

    UNIQUE (owner_user_id, name)
);

