import axios from 'axios'
import { SignatureLike } from '@ethersproject/bytes'
import { sleep } from '../core/utils'

/**
 * Class used for talking to an Entropy validator server
 */
export class ThresholdServer {
  /**
   *
   * @param emsgs encrypted messages to be sent to a validator node
   * @param serverWithPort IP/domain and port of the threshold server, seperated by ':'
   */

  /**
   * @alpha
   *
   * @remarks
   * Is a method of the {@link ThresholdServer} class
   *
   * @param {Array<string>} emsgs - encrypted messages to be sent to a validator node
   * @param {Array<string>} serverWithPort - IP/domain and port of the threshold server, seperated by ':'
   *
   * @returns {Promise<void>} - void
   */
  async sendKeys(emsgs: Array<string>, serverWithPort: Array<string>) {
    for (let i = 0; i < serverWithPort.length; i++) {
      await axios.post(`http://${serverWithPort[i]}/user/new`, emsgs[i], {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }

  /**
   * @deprecated
   *
   * @param {string} sigHash - hash of the message to be signed
   * @param {string} thresholdUrl - url of the threshold server
   * @param {number} retries - number of times to retry
   * @return {*}  {Promise<SignatureLike>} - {@link ThresholdServer}  signature of the message
   * @memberof ThresholdServer
   */
  async pollNodeForSignature(
    sigHash: string,
    thresholdUrl: string,
    retries: number
  ): Promise<SignatureLike> {
    let i = 0
    let status
    let postRequest
    while (status !== 202 && i < retries) {
      try {
        postRequest = await axios.post(`${thresholdUrl}/signer/signature`, {
          message: sigHash,
        })
        status = postRequest.status
      } catch (e) {
        status = 500
        sleep(3000)
        console.log({ message: 'repolling for signature soon', status, i })
      }
      i++
    }
    return Uint8Array.from(atob(postRequest.data), (c) => c.charCodeAt(0))
  }
}
