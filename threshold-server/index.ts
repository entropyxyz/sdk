const axios = require("axios").default;
import { SignatureLike } from "@ethersproject/bytes";

/**
 * Class used for talking to an Entropy validator server
 */
export class ThresholdServer {
  /**
   *
   * @param emsgs encrypted messages to be sent to a validator node
   * @param serverWithPort IP/domain and port of the threshold server, seperated by ':'
   */
  async sendKeys(emsgs: Array<string>, serverWithPort: Array<string>) {
    for (let i = 0; i < serverWithPort.length; i++) {
      await axios.post(`http://${serverWithPort[i]}/user/new`, emsgs[i], {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  /**
   * To be deprecated so light on docs
   */
  async pollNodeForSignature(
    sigHash: string,
    thresholdUrl: string,
    retries: number
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

/**
 * To be deprecated with poll for signature
 */
function sleep(delay: number) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}
