import axios from 'axios'
import { SignatureLike } from '@ethersproject/bytes'
import { sleep } from '../core/utils'
import { ITransactionRequest } from './types'

/**
 * Class used for talking to an Entropy validator server
 */
export class ThresholdServer {
  /**
   * @alpha
   *
   * @remarks
   * Is a method of the {@link ThresholdServer} class
   *
   * @param {Array<string>} emsgs - encrypted messages to be sent to a validator node
   * @param {Array<string>} serversWithPort - IP/domain and port of the threshold server, seperated by ':'
   *
   * @returns {Promise<void>} - void
   */

  async sendKeys(emsgs: Array<string>, serversWithPort: Array<string>) {
    const responses = []
    for (let i = 0; i < serversWithPort.length; i++) {
      responses.push(axios.post(`http://${serversWithPort[i]}/user/new`, emsgs[i], {
        headers: {
          'Content-Type': 'application/json',
        },
      }))
    }

    await Promise.all(responses)
  }

  
  /**
   * Submits the transaction request to the threshold server so its constraints can be validated
   *
   * @async
   * @param {ITransactionRequest} txReq
   * @param {string[]} serversWithPort IP/domain and port of the threshold server, separated by ':'
   * @returns {Promise<Response[]>}
   */
  async submitTransactionRequest(
    txReq: ITransactionRequest,
    serversWithPort: string[]
    ): Promise<Response[]> {
    const responses = [];
    for (const server of serversWithPort) {
      try {
        const response = axios.post(`http://${server}/user/tx`, txReq, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        responses.push(response);
      } catch (error) {
        // handle the error here (e.g. log it, rethrow it, etc.)
        console.error(`Error submitting transaction request to ${server}:`, error);
        return Promise.reject(error);
      }
    }

    return Promise.all(responses);
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
