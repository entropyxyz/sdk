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
   * @returns {Promise<unknown>[]>}
   */

  async sendKeys(
    encryptedKeys: Array<string>,
    serversWithPort: Array<string>
  ): Promise<unknown[]> {
    const val = Promise.all(
      serversWithPort.map(async (server, index) => {
        console.log(encryptedKeys, index, 'sendkeys')
        const response = sendHttpPost(
          `http://${server}/user/new`,
          encryptedKeys[index]
        )
        return response
      })
    )
    console.log(val)
    return val
  }

  /**
   * Submits the transaction request to the threshold server so its constraints can be validated
   *
   * @async
   * @param {ITransactionRequest} txReq
   * @param {string[]} serversWithPort IP/domain and port of the threshold server, separated by ':'
   * @returns {Promise<Promise<unknown>[]>}
   */
  async submitTransactionRequest(
    txReq: ITransactionRequest,
    serversWithPort: string[]
  ): Promise<unknown> {
    return Promise.all(
      serversWithPort.map(async (server) => {
        try {
          console.log(
            JSON.stringify({ data: [txReq] }),
            'txreq from submitTransactionRequest'
          )
          const response = await fetch(`http://${server}/user/tx`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: [txReq] }),
          })
          if (await !response.ok) {
            const err = await response.text().then((text) => {
              throw new Error(text)
            })
            return err
          }
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
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [sigHash] }),
        })

        if (await !postRequest.ok) {
          return postRequest.text().then((text) => {
            throw new Error(text)
          })
        }
        status = postRequest.status as string
      } catch (e) {
        status = 500
        await sleep(3000)
        console.info({
          message: 'repolling for signature soon',
          status,
          i,
          response: e.response,
        })
      }
      i++
    }
    return Uint8Array.from(atob(postRequest), (c) => c.charCodeAt(0))
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
          response: e.response,
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
 * @returns {Promise<Promise<unknown>>}
 */
async function sendHttpPost(url: string, data: any): Promise<unknown> {
  let response

  const rawData = JSON.stringify({ data })
  const parsedData = JSON.parse(rawData)
  console.log(parsedData, 'hiiiiiiiiii')
  try {
    const thing = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: parsedData,
    })

    if (await !thing.ok) {
      return await thing.text().then((text) => {
        throw new Error(text)
      })
    }
    console.log(thing, 'thing')
    response = await thing.json()
  } catch (e) {
    console.log('hit error block in sendHttpPost')
    throw new Error(e.message)
  }

  return response
}
