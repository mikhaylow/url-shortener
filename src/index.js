import express from "express";
import { UrlService } from "./services/url.js";
import { UrlRepository } from "./repositories/url.js";
import { Config } from "./config/config.js";
import { UrlController } from "./controllers/url.js";
import Database from "better-sqlite3";
import morgan from "morgan";

const config = new Config("./config/config.yml");
const configData = await config.load();

const database = new Database(configData.database.path);

const urlRepo = new UrlRepository(database);

urlRepo.init();

const urlService = new UrlService(urlRepo);

const urlController = new UrlController(urlService, configData);

const app = express();

const port = configData.server.port;

app.use(morgan("tiny"));

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.post("/shorten", (req, res) => {
  urlController.saveURL(req, res);
});

app.get("/url/:alias", (req, res) => {
  urlController.getURL(req, res);
});

app.delete("/url/:alias", (req, res) => {
  urlController.deleteURL(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
