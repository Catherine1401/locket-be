CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  google_id TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url text,
  birthday date,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE users;

SELECT * FROM users;

DELETE FROM users;
