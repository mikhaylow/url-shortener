import express from "express";
import { UrlService } from "./services/url_service.js";
import { UrlRepository } from "./repositories/url_repository.js";
import { Config } from "./config/config.js";
import { UrlController } from "./controllers/url_controller.js";

const config = new Config("./config/config.yml");
const configData = await config.load();

const repo = new UrlRepository(configData.database.path);

repo.init();

const service = new UrlService(repo);

const urlController = new UrlController(service);

const app = express();

const port = configData.server.port;

app.use(express.json());

app.post("/shorten", (req, res) => {
  urlController.saveURL(req, res);
});

app.get("/:alias", (req, res) => {
  urlController.getURL(req, res);
});

app.delete("/:alias", (req, res) => {
  urlController.deleteURL(req, res);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
