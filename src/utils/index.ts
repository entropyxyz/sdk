import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { Address } from '../types/internal'

/**
 * Represents a generic object where keys are strings and values can be numbers, strings, string arrays, or nested objects.
 */
export interface AnyObject {
  [key: string]: number | string | string[] | AnyObject
}

/**
 * Determines the type of a given variable.
 *
 * @param {any} thing - The variable to check.
 * @returns {string} The type of the variable as a string.
 */

export function typeofthing(thing) {
  const thingType = typeof thing
  if (thingType === 'object') {
    if (Array.isArray(thing)) return 'array'
    if (thing === null) return 'null'
    return thingType
  } else {
    return thingType
  }
}

/**
 * Removes the '0x' prefix from a hexadecimal string if it exists.
 *
 * @param {string} str - The hexadecimal string.
 * @returns {string} The string without the '0x' prefix.
 */

export function stripHexPrefix(str: string): string {
  if (str.startsWith('0x')) return str.slice(2)
  return str
}

/**
 * Validates whether a given address is a valid Substrate address.
 *
 * @param {Address} address - The address to validate.
 * @returns {boolean} True if the address is valid, false otherwise.
 */

export function isValidSubstrateAddress(address: Address) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

/**
 * Sends an HTTP POST request to a specified URL with the given data.
 *
 * @param {string} url - The URL to send the POST request to.
 * @param {any} data - The data to include in the POST request.
 * @returns {Promise<any>} A promise that resolves with the response data.
 * @throws {Error} If the request fails or the response is not OK.
 */

export async function sendHttpPost(url: string, data: any): Promise<any> {
  const headers = {
    'Content-Type': 'application/json',
  }
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })

  if (!response.ok) {
    throw new Error(
      `request failed ${response.status}, ${
        response.statusText
      } fetch: ${url} FULLRESPONSE: ${await response.text()}`
    )
  }

  const reader = response.body.getReader()
  const start = (controller) => {
    async function pump() {
      const { done, value } = await reader.read()
      if (done) {
        controller.close()
        return
      }
      controller.enqueue(value)
      return pump()
    }
    return pump()
  }
  const stream = new ReadableStream({ start })
  const streamResponse = new Response(await stream)
  if (!streamResponse.ok) {
    throw new Error(
      `request failed ${streamResponse.status}, ${
        streamResponse.statusText
      } FULLRESPONSE: ${await streamResponse.text()}`
    )
  }
  return (await streamResponse.json()).Ok
}

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The hexadecimal representation of the buffer.
 */

export function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Converts a hexadecimal string to an ArrayBuffer.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {ArrayBuffer} The ArrayBuffer representation of the hexadecimal string.
 */

export function hex2buf(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes.buffer
}
