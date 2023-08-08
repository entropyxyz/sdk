import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'

export const isValidSubstrateAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

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