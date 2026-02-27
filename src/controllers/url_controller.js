export class UrlController {
  constructor(service) {
    this.service = service;
  }

  saveURL(req, res) {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const alias = this.service.randStringRunes(6);

      this.service.saveURL(url, alias);

      res.json({ alias });
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
