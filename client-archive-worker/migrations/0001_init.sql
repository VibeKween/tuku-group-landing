-- Full Charge / client archive schema.
-- Source spec: website/design_handoff_full_charge/README.md section 5.
-- Deviations from that spec, and why, are called out inline.

CREATE TABLE clients (
  id            TEXT PRIMARY KEY,        -- 'full-charge'
  name          TEXT NOT NULL,           -- 'Full Charge'
  site_url      TEXT,                    -- 'https://fullchargeapp.com'
  accent_hex    TEXT,                    -- '#4FA3E3'
  created_at    TEXT NOT NULL
);

CREATE TABLE sessions (                  -- one per working session; a tick on the chrono line
  id            TEXT PRIMARY KEY,
  client_id     TEXT NOT NULL REFERENCES clients(id),
  seq           INTEGER NOT NULL,        -- 1, 2, 3 ... drives left-to-right position
  occurred_on   TEXT NOT NULL,           -- '2026-08-19'
  label         TEXT,                    -- 'what are we asking?'
  tick_x        INTEGER NOT NULL         -- board x for this session's chrono tick
);

CREATE UNIQUE INDEX idx_sessions_client_seq ON sessions(client_id, seq);

-- Artifacts are append-only: a re-upload of the same doc_name is a NEW ROW
-- with version = previous + 1, never an UPDATE of the existing row. This is
-- an archive of client engagement history, and a later upload must not
-- destroy an earlier version's record. is_latest marks which row per
-- (client_id, doc_slug) the board and reader should show; the artifact
-- route serves whichever id is requested regardless of is_latest, so old
-- versions remain individually fetchable even once superseded.
CREATE TABLE artifacts (
  id            TEXT PRIMARY KEY,
  session_id    TEXT NOT NULL REFERENCES sessions(id),
  client_id     TEXT NOT NULL REFERENCES clients(id),
  doc_slug      TEXT NOT NULL,           -- stable identity across versions, e.g. 'what-are-we-asking'
  version       INTEGER NOT NULL DEFAULT 1,
  title         TEXT NOT NULL,           -- 'Question Ownership: Full Charge'
  doc_name      TEXT NOT NULL,           -- 'What are we asking' -> filename builder
  kind          TEXT NOT NULL,           -- 'HTML'
  r2_key        TEXT NOT NULL,
  download_name TEXT NOT NULL,           -- 'Tuku Group_What are we asking_8.19.26.html'
  board_x       INTEGER,                 -- board coords; null = auto-place on the session's tick
  board_y       INTEGER,
  connector_color TEXT,                  -- '#E8542A' | '#8B7BB5', alternated on auto-place
  is_latest     INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL
);

CREATE INDEX idx_artifacts_client_slug ON artifacts(client_id, doc_slug, version);
CREATE INDEX idx_artifacts_session ON artifacts(session_id);

-- Auth is per-client, never per-artifact. This table only ever gates board
-- visibility; it must never be checked by the admin upload endpoint, which
-- is authorized by the separate ADMIN_TOKEN secret instead.
CREATE TABLE access_grants (
  id            TEXT PRIMARY KEY,
  client_id     TEXT NOT NULL REFERENCES clients(id),
  passphrase_hash TEXT NOT NULL,         -- 'pbkdf2$<iterations>$<saltB64>$<hashB64>'
  expires_at    TEXT,
  created_at    TEXT NOT NULL
);

CREATE TABLE access_log (
  id            TEXT PRIMARY KEY,
  client_id     TEXT NOT NULL,
  ok            INTEGER NOT NULL,
  ip_hash       TEXT,
  user_agent    TEXT,
  at            TEXT NOT NULL
);
