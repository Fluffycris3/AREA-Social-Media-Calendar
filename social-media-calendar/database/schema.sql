CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_path TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  publish_date DATE NOT NULL,
  publish_time TIME NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  caption TEXT NOT NULL,
  owner TEXT NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('square', 'reel', 'fourFive')),
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  media_url TEXT,
  card_color TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post_channels (
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  PRIMARY KEY (post_id, channel)
);

CREATE TABLE post_notes (
  id INTEGER PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE dashboard_notes (
  id INTEGER PRIMARY KEY,
  body TEXT NOT NULL,
  author_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_posts_brand_date_time ON posts (brand_id, publish_date, publish_time);
CREATE INDEX idx_posts_date_time ON posts (publish_date, publish_time);
CREATE INDEX idx_post_notes_post ON post_notes (post_id);
