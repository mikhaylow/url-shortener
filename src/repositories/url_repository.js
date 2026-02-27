import Database from "better-sqlite3";

export class UrlRepository {
  constructor(path) {
    this.database = new Database(path);
  }

  init() {
    this.database.exec(`
	CREATE TABLE IF NOT EXISTS "url" (
		"id"			    INTEGER,
		"url"			    TEXT NOT NULL,
		"alias"			  TEXT NOT NULL UNIQUE,
		"created_at" 	TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY("id" AUTOINCREMENT)
     );
    `);

    console.log("Database initialized");
  }

  saveURL(url, alias) {
    this.database
      .prepare(`INSERT INTO url (url, alias) VALUES (?, ?)`)
      .run(url, alias);
  }

  getURL(alias) {
    return this.database
      .prepare(`SELECT url FROM url WHERE alias = ?`)
      .get(alias);
  }

  deleteURL(alias) {
    this.database.prepare(`DELETE FROM url WHERE alias = ?`).run(alias);
  }
}
