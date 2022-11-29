const axios = require("axios").default;
import { SignatureLike } from "@ethersproject/bytes";

export class ThresholdServer {

  constructor() {
  }

  async sendKeys(emsg: Array<String>, urls: Array<String>) {
    for (let i = 0; i < urls.length; i++) {
      await axios.post(`${urls[i]}/user/new`, emsg[i], {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  async pollNodeForSignature(
    sigHash: String,
    thresholdUrl: String,
	retries: Number
  ): Promise<SignatureLike> {
    let i = 0;
    let status;
    let postRequest;
    while (status !== 202 && i < retries) {
      try {
        postRequest = await axios.post(`${thresholdUrl}/signer/signature`, {
          message: sigHash,
        });
        status = postRequest.status;
      } catch (e) {
        status = 500;
        sleep(3000);
        console.log({ message: "repolling for signature soon", status, i });
      }
      i++;
    }
    return Uint8Array.from(atob(postRequest.data), (c) => c.charCodeAt(0));
  }
}

function sleep(delay: number) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
