import {
  cryptoWaitReady,
  decodeAddress,
  encodeAddress,
  signatureVerify,
  blake2AsHex,
} from '@polkadot/util-crypto'
import { keccak256, SigningKey } from 'ethers'
import * as polkadotCryptoUtil from '@polkadot/util-crypto'
import { CryptoLib, ResObjectType } from './types'
import { u8aToHex } from '@polkadot/util'
import { SignatureData, AdaptedSignatureData } from '../../signing'

let cryptoLib
const res: ResObjectType = {
  resolve: () => {
    throw new Error('resolve function not yet set')
  },
}

/**
 * Interface for the cryptographic library, detailing core functionality: encryption, decryption, and key management.
 *
 * @see {@link https://www.npmjs.com/package/@entropyxyz/entropy-protocol-nodejs}
 */

let isImported = false
export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})

/**
 * Dynamically loads the appropriate cryptographic library based on the runtime environment (Node.js or browser).
 *
 * @returns The imported crypto library.
 */

export async function loadCryptoLib () {
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
loadCryptoLib()

export const crypto: CryptoLib = new Proxy({} as CryptoLib, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      if (!cryptoLib) {
        throw new Error(
          'cryptoLib loaded incorrectly. Did you await the wasmGlobalsReady function?'
        )
      }
      if (key === 'polkadotCryptoUtil') return polkadotCryptoUtil
      if (key === 'verifySignature') return verifySignature
      if (cryptoLib.Hpke[key]) {
        return cryptoLib.Hpke[key](...params)
      }
      if (cryptoLib.X25519Keypair[key]) {
        return cryptoLib.X25519Keypair[key](...params)
      }
      if (cryptoLib[key]) {
        return cryptoLib[key](...params)
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

async function verifySignature (
  message: string,
  signature: string,
  address: string
): Promise<boolean> {
  const publicKey = decodeAddress(address)
  const hexPublicKey = u8aToHex(publicKey)

  return signatureVerify(message, signature, hexPublicKey).isValid
}

/**
 * Verifies the signature of a of a signed message coming from the signing method in the entropy class.
 *
 * @param {@link SignatureData} - The signature data to be verified.
 * @returns A Promise that resolves to a boolean indicating whether the signature is valid.
 */

export async function verify (sigData: SignatureData | AdaptedSignatureData): Promise<boolean> {
  const { hashType, message, verifyingKey, signature } = sigData

  if (!hashType) throw new Error('hashType not include in the signature data')
  if (!message) throw new Error('message not include in the signature data')
  if (!verifyingKey) throw new Error('verifyingKey not include in the signature data')
  if (!signature) throw new Error('signature not include in the signature data')


  if (hashType.toLowerCase() === 'keccak') {
    const recoveredPk = SigningKey.recoverPublicKey(keccak256(message), signature)
    return SigningKey.computePublicKey(recoveredPk) === verifyingKey
  }

  if (hashType.toLowerCase() === 'blake2_256') {
    const address = encodeAddress(blake2AsHex(verifyingKey))
    return signatureVerify(message, signature, address).isValid
  }

  throw new Error(`unsupported hashType: ${hashType}`)
}
