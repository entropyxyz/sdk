import axios, { AxiosResponse } from 'axios'
import { SignatureLike } from '@ethersproject/bytes'
import { sleep } from '../core/utils'
import { ITransactionRequest } from './types'
export * from './types'

/**
 * Class used for talking to an Entropy validator server
 */
export class ThresholdServer {
  /**
   * @alpha
   *
   * @async
   * @remarks
   * Is a method of the {@link ThresholdServer} class
   *
   * @param {Array<string>} emsgs - encrypted messages to be sent to a validator node
   * @param {Array<string>} serversWithPort - IP/domain and port of the threshold server, seperated by ':'
   *
   * @returns {Promise<AxiosResponse<any, any>[]>}
   */

  async sendKeys(
    encryptedKeys: Array<string>,
    serversWithPort: Array<string>
  ): Promise<AxiosResponse<any, any>[]> {
    return Promise.all(
      serversWithPort.map(async (server, index) =>
        sendHttpPost(`http://${server}/user/new`, encryptedKeys[index])
      )
    )
  }

  /**
   * Submits the transaction request to the threshold server so its constraints can be validated
   *
   * @async
   * @param {ITransactionRequest} txReq
   * @param {string[]} serversWithPort IP/domain and port of the threshold server, separated by ':'
   * @returns {Promise<AxiosResponse<any, any>[]>}
   */
  async submitTransactionRequest(
    txReq: ITransactionRequest,
    serversWithPort: string[]
  ): Promise<AxiosResponse<any, any>[]> {
    return Promise.all(
      serversWithPort.map(async (server) =>
        sendHttpPost(`http://${server}/user/tx`, txReq)
      )
    )
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
        postRequest = await axios.post(
          `http://${thresholdUrl}/signer/signature`,
          {
            message: sigHash,
          }
        )
        status = postRequest.status
      } catch (e) {
        status = 500
        sleep(3000)
        console.info({ message: 'repolling for signature soon', status, i })
      }
      i++
    }
    return Uint8Array.from(atob(postRequest.data), (c) => c.charCodeAt(0))
  }
}

/**
 * Sends an HTTP POST request to the specified URL with the given data and headers
 *
 * @async
 * @param url the URL to send the POST request to
 * @param data the data to send in the request body
 * @returns {Promise<AxiosResponse<any, any>>}
 */
async function sendHttpPost(
  url: string,
  data: any
): Promise<AxiosResponse<any, any>> {
  const headers = {
    'Content-Type': 'application/json',
  }
  return axios.post(url, data, {
    headers: headers,
  })
}
