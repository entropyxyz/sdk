import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify,
} from '@polkadot/util-crypto'
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
  },
}

loadCryptoLib()

/**
 * Interface for the cryptographic library, detailing core functionality: encryption, decryption, and key management.
 *
 * @see {@link https://www.npmjs.com/package/@entropyxyz/entropy-protocol-nodejs}
 */

export interface CryptoLib {
  // from polkadotjs
  verifySignature: (
    message: string,
    signature: string,
    address: string
  ) => Promise<boolean>
  // from chacha20poly1305
  fromHex: (input: string) => Uint8Array
  /**
   * Encrypts the provided message and signs it using the X25519 and ChaCha20Poly1305 algorithms.
   * Uses the provided secret key for encryption and the server's Diffie-Hellman (DH) key for the signature.
   */
  encryptAndSign: (
    secretKey: Uint8Array,
    encoded: Uint8Array,
    serverDHKey: Uint8Array
  ) => Promise<string>
  /**
   * Decrypts a provided message and verifies its authenticity.
   * Uses the provided secret key for decryption.
   */
  decryptAndVerify: (secretKey: Uint8Array, msg: string) => Promise<string>
  /**
   * Derives the public key from the provided secret key.
   */
  publicKeyFromSecret: (secretKey: Uint8Array) => Promise<Uint8Array>
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
      if (cryptoLib.X25519Chacha20Poly1305[key]) {
        return cryptoLib.X25519Chacha20Poly1305[key](...params)
      }
      if (!cryptoLib[key]) {
        throw new Error(
          `Function "${key as string}" is not available in the crypto library`
        )
      }

      return cryptoLib[key](...params)
    }
  },
})

/**
 * Verifies the signature of a message using a substrate address and returns the result.
 *
 * @param message - The message to be verified.
 * @param signature - The signature to verify.
 * @param address - The address associated with the public key.
 * @returns A Promise that resolves to a boolean indicating whether the signature is valid.
 */

async function verifySignature(
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  const publicKey = decodeAddress(address)
  const hexPublicKey = u8aToHex(publicKey)

  return signatureVerify(message, signature, hexPublicKey).isValid
}

/**
 * Dynamically loads the appropriate cryptographic library based on the runtime environment (Node.js or browser).
 *
 * @returns The imported crypto library.
 */

export async function loadCryptoLib() {
  if (isImported) return cryptoLib

  if (!globalThis.window) {
    cryptoLib = await import('@entropyxyz/entropy-protocol-nodejs')
  } else {
    cryptoLib = await import('@entropyxyz/entropy-protocol-web')
  }

  await cryptoWaitReady()
  isImported = true
  res.resolve()
  return cryptoLib
}
