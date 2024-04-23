// import { decodeAddress, encodeAddress } from '@polkadot/keyring'
// import { hexToU8a, isHex } from '@polkadot/util'
// import { Address } from '../types'

// export interface AnyObject {
//   [key: string]: number | string | string[] | AnyObject
// }

// export function typeofthing (thing) {
//   const thingType = typeof thing
//   if (thingType === 'object') {
//     if (Array.isArray(thing)) return 'array'
//     if (thing === null) return 'null'
//     return thingType
//   } else {
//     return thingType
//   }
// }


// export function stripHexPrefix (str: string): string {
//   if (str.startsWith('0x')) return str.slice(2)
//   return str
// }

// export function isValidSubstrateAddress (address: Address) {
//   try {
//     encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

//     return true
//   } catch (error) {
//     return false
//   }
// }

// export async function sendHttpPost (url: string, data: any): Promise<any> {
//   const headers = {
//     'Content-Type': 'application/json',
//   }
//   const response = await fetch(url, {
//     method: 'POST',
//     headers,
//     body: data,
//   })

//   if (!response.ok) {
//     throw new Error(
//       `request failed ${response.status}, ${
//         response.statusText
//       } fetch: ${url} FULLRESPONSE: ${await response.text()}`
//     )
//   }

//   const reader = response.body.getReader()
//   const start = (controller) => {
//     async function pump () {
//       const { done, value } = await reader.read()
//       if (done) {
//         controller.close()
//         return
//       }
//       controller.enqueue(value)
//       return pump()
//     }
//     return pump()
//   }
//   const stream = new ReadableStream({ start })
//   const streamResponse = new Response(await stream)
//   if (!streamResponse.ok) {
//     throw new Error(
//       `request failed ${streamResponse.status}, ${
//         streamResponse.statusText
//       } FULLRESPONSE: ${await streamResponse.text()}`
//     )
//   }
//   return (await streamResponse.json()).Ok
// }

// export function buf2hex (buffer: ArrayBuffer): string {
//   return [...new Uint8Array(buffer)]
//     .map((x) => x.toString(16).padStart(2, '0'))
//     .join('')
// }

// export function hex2buf (hex: string): ArrayBuffer {
//   const bytes = new Uint8Array(Math.ceil(hex.length / 2))
//   for (let i = 0; i < bytes.length; i++) {
//     bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
//   }
//   return bytes.buffer
// }

import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { Address } from '../types'
import { ValidatorInfo } from '../types'
import { ApiPromise } from '@polkadot/api'
import { Option } from '@polkadot/types'
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

export function arraysEqual (a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}
export function convertToSS58 (u8a: Uint8Array, prefix = 42): string {
  return encodeAddress(u8a, prefix);
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

export async function pickValidatorsBySignature (
  substrate: ApiPromise,
  sigRequest: string
): Promise<ValidatorInfo[]> {
  const entries = await substrate.query.stakingExtension.signingGroups.entries() 
  const stashKeys = entries.map((group) => {
    const keyGroup = group[1] as unknown as Option<any>
    const index = parseInt(sigRequest, 16) % keyGroup.unwrap().length
    return keyGroup.unwrap()[index]
  })

  const rawValidatorInfo = await Promise.all(
    stashKeys.map((stashKey) =>
      substrate.query.stakingExtension.thresholdServers(stashKey)
    )
  )

  const validatorsInfo: ValidatorInfo[] = rawValidatorInfo.map((validator) => {
    const validatorHuman = validator.toHuman() as { 
      x25519PublicKey: string
      endpoint: string
      tssAccount: string
    }

    return {
      x25519_public_key: validatorHuman.x25519PublicKey,
      ip_address: validatorHuman.endpoint,
      tss_account: validatorHuman.tssAccount,
    }
  })

  return validatorsInfo
}