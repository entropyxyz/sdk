const { cryptoWaitReady, decodeAddress, signatureVerify } = require('@polkadot/util-crypto');
import { u8aToHex } from '@polkadot/util'

interface ResolveType {
  (value?: void | PromiseLike<void>): void
}

interface ResObjectType {
  resolve: ResolveType
}

let isImported = false
let cryptoLib
const res: ResObjectType = {
  resolve: () => {
    throw new Error('resolve function not yet set')
  }
}

loadCryptoLib()

export interface CryptoLib {
  // from polkadotjs
  verifySignature: (message: string, signature: string, address: string) => Promise<boolean>
  // from chacha20poly1305
  from_hex: (input: string) => Uint8Array
  encrypt_and_sign: (
    secretKey: Uint8Array,
    encoded: Uint8Array,
    serverDHKey: Uint8Array
  ) => Promise<string>
  decrypt_and_verify: (secretKey: Uint8Array, msg: string) => Promise<string>
  public_key_from_secret: (secretKey: Uint8Array) => Promise<Uint8Array>
}

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})

export const crypto: CryptoLib = new Proxy({} as CryptoLib, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      if (!cryptoLib) {
        throw new Error('cryptoLib loaded incorrectly')
      }
      if (key === 'verifySignature') return verifySignature
      if (!cryptoLib[key]) {
        throw new Error(
          `Function "${key as string}" is not available in the crypto library`
        )
      }

      return cryptoLib[key](...params)
    }
  },
})

async function verifySignature (message: string, signature: string, address: string): Promise<boolean> {
  const publicKey = decodeAddress(address)
  const hexPublicKey = u8aToHex(publicKey)

  return signatureVerify(message, signature, hexPublicKey).isValid
}

export async function loadCryptoLib () {
  if (isImported) return cryptoLib

  if (typeof window === 'undefined') {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-nodejs')
  } else {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-web')
  }
  await cryptoWaitReady()
  isImported = true
  res.resolve()
  return cryptoLib
}
