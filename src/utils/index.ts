import { WsProvider, ApiPromise } from '@polkadot/api'
import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import Debug from 'debug'
import { Address } from '../types/internal'

export const debug = Debug('@entropyxyz/sdk')

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

export function typeofthing (thing) {
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

export function stripHexPrefix (str: string): string {
  if (str.startsWith('0x')) return str.slice(2)
  return str
}

/**
 * Adds the '0x' prefix to a string if it exists.
 *
 * @param {string} str - The hexadecimal string.
 * @returns {string} The string with the '0x' prefix.
 */

export function addHexPrefix (str: string): string {
  if (typeof str === 'string') {
    if (str.startsWith('0x')) return str
    return `0x${str}`
  }
  throw new TypeError('not a string')
}

/**
 * Validates whether a given address is a valid Substrate address.
 *
 * @param {Address} address - The address to validate.
 * @returns {boolean} True if the address is valid, false otherwise.
 */

export function isValidSubstrateAddress (address: Address) {
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

export async function sendHttpPost (url: string, data: any): Promise<any> {
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
    async function pump () {
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
  const responseResult = await streamResponse.json()
  const oks = responseResult.map(r => r.Ok)
  return oks
}

/**
 * Creates substrate api provider without needing to instantiate an entropy instance
 * 
 * @param {string} endpoint - Endpoint for the api
 * @returns {ApiPromise} Api tool to interact with protocol
 */

export function createSubstrate (endpoint: string): ApiPromise {
  const wsProvider = new WsProvider(endpoint)
  return new ApiPromise({ provider: wsProvider, noInitWarn: true })
}

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 *
 * @param {ArrayBuffer} buffer - The buffer to convert.
 * @returns {string} The hexadecimal representation of the buffer.
 */

export function bufferToHex (buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('hex')
}

export function toHex (str: any) {
  let result = '';
  for (let i=0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  } 
  return result;
}


/**
 * Converts a hexadecimal string to an ArrayBuffer.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {ArrayBuffer} The ArrayBuffer representation of the hexadecimal string.
 */

export function hexStringToBuffer (hex: string): ArrayBuffer {
  return Buffer.from(stripHexPrefix(hex), 'hex')
}

/**
 * Converts a hexadecimal string to a JSON object.
 *
 * @param {string} hex - The hexadecimal string to convert.
 * @returns {unknown} The ArrayBuffer representation of the hexadecimal string.
 */

export function hexStringToJSON (hex: string): ArrayBuffer {
  return JSON.parse(hexStringToBuffer(hex).toString())
}

export function hexStringToUint8Array (hex: string): Uint8Array {
  if (hex.startsWith('0x')) {
    hex = hex.slice(2)
  }
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters')
  }

  const byteArray = new Uint8Array(hex.length / 2)

  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(hex.substr(i * 2, 2), 16)
  }

  return byteArray
}
