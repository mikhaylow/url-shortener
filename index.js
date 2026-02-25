import Database from "better-sqlite3";
import express from "express";

class Repository {
  constructor(path) {
    this.path = path;
    this.database = new Database(this.path);
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

  // не используется
  close() {
    this.database.close();
  }
}

class Service {
  constructor(repository) {
    this.repository = repository;
    this.chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  }

  randStringRunes(length) {
    let result = "";
    const charsLength = this.chars.length;
    for (let i = 0; i < length; i++) {
      result += this.chars[Math.floor(Math.random() * charsLength)];
    }
    return result;
  }

  saveURL(url, alias) {
    return this.repository.saveURL(url, alias);
  }

  getURL(alias) {
    return this.repository.getURL(alias);
  }

  deleteURL(alias) {
    return this.repository.deleteURL(alias);
  }
}

// config
const repo = new Repository("./storage/storage.db");

repo.init();

const service = new Service(repo);

const app = express();
// config
const port = 3000;

app.use(express.json());

app.post("/api/v1/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const alias = service.randStringRunes(6);

    service.saveURL(url, alias);

    res.json({ alias });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:alias", async (req, res) => {
  try {
    const { alias } = req.params;

    if (!alias) {
      return res.status(400).json({ error: "Alias is required" });
    }

    const result = service.getURL(alias);

    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }

    res.redirect(result.url);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/v1/:alias", async (req, res) => {
  try {
    const { alias } = req.params;

    if (!alias) {
      return res.status(400).json({ error: "Alias is required" });
    }

    service.deleteURL(alias);
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
