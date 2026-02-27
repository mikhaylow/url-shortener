export class UrlService {
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
