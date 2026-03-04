import fs from "node:fs/promises";
import yaml from "js-yaml";

export class Config {
  constructor(path) {
    this.path = path;
  }

  async load() {
    try {
      const data = yaml.load(await fs.readFile(this.path, "utf-8"));
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
