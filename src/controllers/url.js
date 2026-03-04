export class UrlController {
  constructor(service, config) {
    this.service = service;
    this.config = config;
  }

  saveURL(req, res) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const alias = this.service.randStringRunes(6);

      const exist = this.service.saveURL(url, alias);

      const shortenUrl = `${this.config.server.host}${this.config.server.port}/url/${exist || alias}`;

      res.json({ url: shortenUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  getURL(req, res) {
    try {
      const { alias } = req.params;

      if (!alias) {
        return res.status(400).json({ error: "Alias is required" });
      }

      const result = this.service.getURL(alias);

      if (!result) {
        return res.status(404).json({ error: "URL not found" });
      }

      res.redirect(result.url);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  deleteURL(req, res) {
    try {
      const { alias } = req.params;

      if (!alias) {
        return res.status(400).json({ error: "Alias is required" });
      }

      this.service.deleteURL(alias);

      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
