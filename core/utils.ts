import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'

export const readKey = async (path: string) => {
  if (!path) {
    throw new Error('Path is required')
  }

  if (typeof window === 'undefined') {
    const { readFileSync } = await import('fs')
    // If we are in Node.js, we can use the fs module
    const buffer = readFileSync(path)

    const result = new Uint8Array(buffer.byteLength)
    buffer.copy(result)
    buffer.fill(0)
    return result
  } else {
    // If we are in the browser, we need to use the FileReader API
    const file = new FileReader()
    const result: Promise<Uint8Array> = new Promise((resolve, reject) => {
      file.onload = () => {
        const buffer = new Uint8Array(file.result as ArrayBuffer)
        resolve(buffer)
      }
      file.onerror = reject
    })
    file.readAsArrayBuffer(new Blob([path]))

    return result
  }
}

export const isValidSubstrateAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

/**
 * To be deprecated with poll for signature
 *
 * @param delay - delay in milliseconds
 * @returns
 *
 */
export function sleep(delay: number) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

/**
 * Sends an HTTP POST request to the specified URL with the given data and headers
 *
 * @async
 * @param url the URL to send the POST request to
 * @param data the data to send in the request body
 * @returns {Promise<AxiosResponse<any, any>>}
 */
export async function sendHttpPost(url: string, data: any): Promise<any> {
  const headers = {
    'Content-Type': 'application/json',
  }
  return fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
}
