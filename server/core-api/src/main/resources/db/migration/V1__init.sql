CREATE DOMAIN outbound_email_status AS VARCHAR(20)
    DEFAULT 'PENDING'
    NOT NULL
    CONSTRAINT check_outbound_status CHECK (VALUE IN ('PENDING', 'SENT', 'FAILED', 'BOUNCED', 'COMPLAINED', 'DELIVERED'));

CREATE DOMAIN inbound_email_status AS VARCHAR(20)
    DEFAULT 'WAITING'
    NOT NULL
    CONSTRAINT check_inbound_status CHECK (VALUE IN ('WAITING', 'RECEIVED'));

CREATE DOMAIN inbound_evaluation_status AS VARCHAR(20)
    DEFAULT 'PENDING'
    NOT NULL
    CONSTRAINT check_evaluation_status CHECK (VALUE IN ('PENDING', 'SUCCESS', 'FAILED'));

CREATE TABLE respondent (
    id                           UUID                         PRIMARY KEY DEFAULT gen_random_uuid(),
    name                          VARCHAR(100)                NOT NULL,
    email                         VARCHAR(100)                NOT NULL,
    group_id                      TEXT                        NOT NULL,
    created_at                    TIMESTAMPTZ                 DEFAULT NOW(),

    outbound_status               outbound_email_status,
    inbound_status                inbound_email_status,
    inbound_evaluation_status     inbound_evaluation_status,

    UNIQUE (email, group_id)
);