-- ============================================================
-- Locket Database Schema
-- PostgreSQL 16+
-- ============================================================

-- ── ENUM types ───────────────────────────────────────────────
CREATE TYPE status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE friend_status AS ENUM ('friend', 'unfriend');

-- ── users ────────────────────────────────────────────────────
CREATE TABLE users (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id    TEXT         UNIQUE NOT NULL,
  refresh_token TEXT,
  share_code   VARCHAR(255) UNIQUE NOT NULL DEFAULT translate(
                  encode(gen_random_bytes(4), 'base64'), '+/=', ''
                ),
  display_name VARCHAR(255) NOT NULL,
  email        VARCHAR(255) UNIQUE NOT NULL,
  avatar_url   TEXT,
  birthday     DATE,
  created_at   TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMPTZ  DEFAULT CURRENT_TIMESTAMP
);

-- ── moments ──────────────────────────────────────────────────
CREATE TABLE moments (
  id               SERIAL PRIMARY KEY,
  image_url        TEXT        NOT NULL,
  thumbnail        TEXT        NOT NULL,
  image_public_id  TEXT        NOT NULL,
  caption          TEXT,
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at       TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at       TIMESTAMPTZ
);

-- ── request_friends ──────────────────────────────────────────
CREATE TABLE request_friends (
  id           SERIAL PRIMARY KEY,
  from_user_id UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  to_user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status       status      DEFAULT 'pending',
  created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Ngăn trùng cặp yêu cầu (bất kể chiều)
CREATE UNIQUE INDEX unique_request_pair_unordered
  ON request_friends (LEAST(from_user_id, to_user_id), GREATEST(from_user_id, to_user_id));

-- ── friends ──────────────────────────────────────────────────
CREATE TABLE friends (
  id         SERIAL PRIMARY KEY,
  user_id1   UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  user_id2   UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status     friend_status DEFAULT 'friend',
  created_at TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ   DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX unique_friends_pair_unordered
  ON friends (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));

-- ── conversations ────────────────────────────────────────────
CREATE TABLE conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id1   UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  user_id2   UUID        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX unique_conversations_pair_unordered
  ON conversations (LEAST(user_id1, user_id2), GREATEST(user_id1, user_id2));

-- ── messages ─────────────────────────────────────────────────
CREATE TABLE messages (
  id                  SERIAL PRIMARY KEY,
  conversation_id     UUID        NOT NULL REFERENCES conversations(id) ON DELETE RESTRICT,
  sender_id           UUID        NOT NULL REFERENCES users(id)         ON DELETE RESTRICT,
  reply_to_moment_id  INTEGER              REFERENCES moments(id)       ON DELETE SET NULL,
  content             TEXT        NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMPTZ,
  deleted_at          TIMESTAMPTZ
);
