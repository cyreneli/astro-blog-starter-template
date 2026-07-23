CREATE TABLE IF NOT EXISTS cms_documents (
	id TEXT PRIMARY KEY,
	draft_json TEXT NOT NULL,
	published_json TEXT,
	updated_at TEXT NOT NULL,
	published_at TEXT
);
