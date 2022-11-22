const axios = require("axios").default;

export class ThresholdServer {
  url: String;

  constructor(url: String) {
    this.url = url;
  }

  async sendKey(emsg: String): Promise<String> {
    const postRequest = await axios.post(`${this.url}/user/new`, emsg, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return postRequest;
  }
}
