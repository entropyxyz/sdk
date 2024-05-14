import {
  cryptoWaitReady,
  decodeAddress,
  signatureVerify
} from '@polkadot/util-crypto'

import * as polkadotCryptoUtil from '@polkadot/util-crypto'

import { u8aToHex } from '@polkadot/util'

import * as PolkadotCryptoTypes from './types/internal';

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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // fuck-polkadot
  polkadotCrypto: any
  verifySignature: (message: string, signature: string, address: string) => Promise<boolean>

  fromHex: (input: string) => Promise<Uint8Array>

  /**
   *
   * @returns Constructor to randomly generate an `X25519Keypair`.
   */

  generate: (X25519Keypair: Uint8Array) => Promise<Uint8Array>

  /**
   * Generates a secret sr25519 signing key and returns it as a Uint8Array.
   * This is really only exposed for testing purposes, as you can also use Polkadot-JS to generate sr25519 keypairs.
   * @param sr25519SigningKey
   * @returns
   */

  generateSigningKey: ( sr25519SigningKey: Uint8Array) => Promise<Uint8Array>

  /**
   * Encrypt and sign a message. Takes an sr25519 secret key, a payload to encrypt, and the recipient's publicX25519key,
   * all given as Uint8Arrays. Returns an EncryptedSignedMessage as a JSON serialized string.
   * @param secretKey
   * @param encodedPayload
   * @param publicX25519key
   * @param serverDHKey
   * @returns
   */

  encryptAndSign: (
    secretKey: Uint8Array,
    encodedPayload: Uint8Array,
    publicX25519key: Uint8Array,
    serverDHKey: Uint8Array
  ) => Promise<string>

  /**
   * Decrypts a provided message and verifies its authenticity.
   * Uses the provided secret key for decryption.
   */

  decryptAndVerify: (X25519Keypair: Uint8Array, msg: string) => Promise<string>

  /**
   * Derives the public key from the provided secret key.
   */
  
  publicKeyFromSecret: (X25519Keypair: Uint8Array) => Promise<Uint8Array>
}

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})

export const crypto: CryptoLib = new Proxy({} as CryptoLib, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      if (!cryptoLib) {
        throw new Error('cryptoLib loaded incorrectly. Did you await the wasmGlobalsReady function?')
      }
      if (key === 'polkadotCrypto') return polkadotCryptoUtil
      if (key === 'verifySignature') return verifySignature
      if (cryptoLib.Hpke[key]) {
        return cryptoLib.Hpke[key](...params)
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
