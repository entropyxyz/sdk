import { KeyShare, PublicKey } from '../types'

let isImported = false
let cryptoLib
const res: any = {}
loadCryptoLib()

export interface CryptoLib {
  from_hex: (input: string) => Uint8Array;
  parseServerDHKey: (serverDHInfo: { x25519PublicKey: PublicKey }) => Promise<Uint8Array>;
  encrypt_and_sign: (secretKey: Uint8Array, encoded: Uint8Array, serverDHKey: Uint8Array) => Promise<string>;

}

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})


export const crypto: CryptoLib = new Proxy({} as CryptoLib, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      return cryptoLib[key](...params)
    }
  }
})


export async function loadCryptoLib () {
  if (isImported) return cryptoLib
  // if node enviroment load node library
  if (typeof window === 'undefined') {
    cryptoLib = await import(
      '@entropyxyz/x25519-chacha20poly1305-nodejs'
    )
    isImported = true
    res.resolve(true)
    return cryptoLib
  } else {
    cryptoLib = await import(
      '@entropyxyz/x25519-chacha20poly1305-web'
    )
    isImported = true
    res.resolve(true)
    return cryptoLib
  }
}