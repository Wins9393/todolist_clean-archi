CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS todos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT     NOT NULL,
  done       BOOLEAN  NOT NULL DEFAULT FALSE,
  is_parent  BOOLEAN  NOT NULL DEFAULT FALSE,
  parent_id  UUID     NULL REFERENCES todos(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_todos_parent ON todos(parent_id);
