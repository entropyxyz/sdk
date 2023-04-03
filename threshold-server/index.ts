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
  ): Promise<unknown[]> {
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
  ): Promise<unknown> {
    return Promise.all(
      serversWithPort.map(async (server) => {
        try {
          const response = await fetch(`http://${server}/user/tx`, {
            method: 'POST',
            body: JSON.stringify(txReq),
            headers: {
              'Content-Type': 'application/json',
            },
          })
          const data = await response.json()
          return data
        } catch (e) {
          console.error(e)
        }
      })
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
        postRequest = await fetch(`http://${thresholdUrl}/signer/signature`, {
          method: 'POST',
          body: JSON.stringify({
            sigHash,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        status = postRequest.status
      } catch (e) {
        status = 500
        await sleep(3000)
        console.info({
          message: 'repolling for signature soon',
          status,
          i,
          response: e.response.data,
        })
      }
      i++
    }
    return Uint8Array.from(atob(postRequest.data), (c) => c.charCodeAt(0))
  }

  /**
   * @deprecated
   *
   * @param {ITransactionRequest} evmTransactionRequest - evm transaction request to be sent
   * @param {string} thresholdUrls - urls of the threshold server
   * @param {number} retries - number of times to retry
   * @memberof ThresholdServer
   */
  async pollNodeToStartSigning(
    evmTransactionRequest: ITransactionRequest,
    thresholdUrls: string[],
    retries: number
  ) {
    let i = 0
    let status
    let postRequest
    while (status !== 202 && i < retries) {
      try {
        postRequest = await this.submitTransactionRequest(
          evmTransactionRequest,
          thresholdUrls
        )
        status = postRequest.status
      } catch (e: any) {
        await sleep(3000)
        console.info({
          message: 'repolling for signature start soon',
          status,
          response: e.response.data,
          i,
        })
      }
      i++
    }
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
async function sendHttpPost(url: string, data: any): Promise<unknown> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const json = await response.json()
  return json
}
