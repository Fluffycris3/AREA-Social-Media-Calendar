CREATE TABLE brands (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo_text TEXT NOT NULL,
  color TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id INTEGER PRIMARY KEY,
  brand_id TEXT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  publish_date DATE NOT NULL,
  publish_time TIME NOT NULL,
  title TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT NOT NULL,
  caption TEXT NOT NULL,
  thumbnail_url TEXT,
  card_color TEXT,
  audience TEXT,
  owner TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE INDEX idx_posts_brand_date ON posts (brand_id, publish_date);
CREATE INDEX idx_post_notes_post ON post_notes (post_id);
