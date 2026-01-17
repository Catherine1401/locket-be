CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  google_id TEXT UNIQUE NOT NULL,
  refresh_token TEXT,
  share_code VARCHAR(255) UNIQUE NOT NULL,

  display_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url text,
  birthday date,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users
ALTER COLUMN share_code
SET DEFAULT translate(
  encode(gen_random_bytes(4), 'base64'),
  '+/=', ''
);

CREATE TABLE moments (
  id serial PRIMARY KEY,
  image_url text NOT NULL,
  image_public_id text NOT NULL,
  caption text,
  user_id uuid NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Foreign Key
ALTER TABLE moments
ADD CONSTRAINT fk_moments_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE RESTRICT;


-- chore
DROP TABLE users;

SELECT * FROM users;

DELETE FROM users;
