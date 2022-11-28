const axios = require("axios").default;

export class ThresholdServer {
  urls: Array<String>;

  constructor(urls: Array<String>) {
    this.urls = urls;
  }

  async sendKeys(emsg: Array<String>) {
    for (let i = 0; i < this.urls.length; i++) {
      await axios.post(`${this.urls[i]}/user/new`, emsg[i], {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
}
