import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { Address } from '../types'

export interface AnyObject {
  [key: string]: number | string | string[] | AnyObject
}

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


export function stripHexPrefix (str: string): string {
  if (str.startsWith('0x')) return str.slice(2)
  return str
}

export function isValidSubstrateAddress (address: Address) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

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
  return (await streamResponse.json()).Ok
}

export function buf2hex (buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
}

export function hex2buf (hex: string): ArrayBuffer {
  const bytes = new Uint8Array(Math.ceil(hex.length / 2))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  }
  return bytes.buffer
}