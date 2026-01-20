-- users
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

-- alter users
ALTER TABLE users
ALTER COLUMN share_code
SET DEFAULT translate(
  encode(gen_random_bytes(4), 'base64'),
  '+/=', ''
);

-- create moments
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

-- create request_friends

CREATE TYPE status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE request_friends (
  id serial PRIMARY KEY,
  from_user_id uuid NOT NULL,
  to_user_id uuid NOT NULL,
  status status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key
ALTER TABLE request_friends
ADD CONSTRAINT fk_request_friends_from_user
FOREIGN KEY (from_user_id)
REFERENCES users(id)
ON DELETE RESTRICT;

ALTER TABLE request_friends
ADD CONSTRAINT fk_request_friends_to_user
FOREIGN KEY (to_user_id)
REFERENCES users(id)
ON DELETE RESTRICT;


CREATE UNIQUE INDEX unique_request_pair_unordered
ON request_friends (
  LEAST(from_user_id, to_user_id),
  GREATEST(from_user_id, to_user_id)
);

-- create friends

CREATE TYPE friend_status AS ENUM ('friend', 'unfriend');

CREATE TABLE friends (
  id serial PRIMARY KEY,
  user_id1 uuid NOT NULL,
  user_id2 uuid NOT NULL,
  status friend_status default 'friend',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Foreign Key
ALTER TABLE friends
ADD CONSTRAINT fk_friends_user1
FOREIGN KEY (user_id1)
REFERENCES users(id)
ON DELETE RESTRICT;

ALTER TABLE friends
ADD CONSTRAINT fk_friends_user2
FOREIGN KEY (user_id2)
REFERENCES users(id)
ON DELETE RESTRICT;


CREATE UNIQUE INDEX unique_friends_pair_unordered
ON friends (
  LEAST(user_id1, user_id2),
  GREATEST(user_id1, user_id2)
);

-- chore
DROP TABLE users;

SELECT * FROM users;

DELETE FROM users;
