CREATE DOMAIN outbound_email_status AS VARCHAR(20)
    CONSTRAINT check_outbound_status CHECK (VALUE IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED', 'COMPLAINED', 'DELIVERED'));

CREATE DOMAIN inbound_email_status AS VARCHAR(20)
    CONSTRAINT check_inbound_status CHECK (VALUE IN ('WAITING', 'RECEIVED'));

CREATE DOMAIN inbound_evaluation_status AS VARCHAR(20)
    CONSTRAINT check_evaluation_status CHECK (VALUE IN ('PENDING', 'SUCCESS', 'FAILED'));

CREATE TABLE respondent (
    id                            UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    name                          VARCHAR(100)                NOT NULL,
    email                         TEXT                        NOT NULL,
    group_id                      TEXT                        NOT NULL,
    created_at                    TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),

    outbound_status               outbound_email_status       NOT NULL DEFAULT 'PENDING',
    inbound_status                inbound_email_status        NOT NULL DEFAULT 'WAITING',
    inbound_evaluation_status     inbound_evaluation_status   NOT NULL DEFAULT 'PENDING',

    UNIQUE (email, group_id)
);