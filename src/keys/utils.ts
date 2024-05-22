import { Keypair } from '@polkadot/util-crypto/types'
import { Keyring as PolkadotKeyring } from '@polkadot/keyring'
import {
  sr25519PairFromSeed,
  keyExtractPath,
  keyFromPath,
  randomAsHex,
} from '@polkadot/util-crypto'
import { debug } from '../utils'
import { crypto } from '../utils/crypto'
import { Pair } from './types/internal'
import { ChildKeyBasePaths } from './types/constants'

const {
  // sr25519PairFromSeed,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  // keyFromPath,
  // keyExtractPath,
} = crypto.polkadotCryptoUtil

/**
 * Converts a mnemonic phrase to a mini secret seed.
 *
 * @param {string} m - The mnemonic phrase.
 * @returns {Promise<Uint8Array>} The mini secret seed.
 */

export function seedFromMnemonic (m) {
  return mnemonicToMiniSecret(m)
}

/**
 * Generates a derivation path based on the type and UIDv4.
 *
 * @param {object} params - The parameters for generating the path.
 * @param {string} params.type - The type of key.
 * @param {UIDv4} params.uid - The UIDv4.
 * @returns {string} The generated derivation path.
 * @throws {TypeError} If the UIDv4 does not match the expected format.
 */

export function getPath (type): string {
  const basePath = ChildKeyBasePaths[type]
  if (basePath.endsWith('/')) {
    return `${basePath}${randomAsHex().slice(2)}`
  }
  return basePath
}

/**
 * Generates a new mnemonic phrase.
 *
 * @returns {string} The generated mnemonic phrase.
 */

export function generateMnemonic () {
  return mnemonicGenerate()
}

/**
 * Generates a new seed from a mnemonic phrase.
 *
 * @returns {string} The generated seed.
 */

export function generateSeed (): string {
  const mnemonic = mnemonicGenerate()
  const mnemonicMini = mnemonicToMiniSecret(mnemonic)

  return mnemonicMini
}

/**
 * Generates a key pair from a seed and optional derivation path.
 *
 * @param {string} seed - The seed for generating the key pair.
 * @param {string} [derivation] - The optional derivation path.
 * @returns {object} An object containing the address and key pair.
 * @throws {TypeError} If the derivation path is not valid.
 */

export function generateKeyPairFromSeed (
  seed: string,
  derivation?: string
): { address: string; pair: Pair } {
  let pair
  // discard the keyring on every use because are keyring is better suited
  // for our code
  const polkadotKeyring = new PolkadotKeyring({ type: 'sr25519' })
  if (derivation) {
    debug('derivation', derivation)
    const masterPair = sr25519PairFromSeed(seed)
    const { path } = keyExtractPath(derivation)
    const kp = keyFromPath(masterPair, path, 'sr25519')
    pair = polkadotKeyring.addFromUri(`${seed}${derivation}`)
    debug('path address check', derivation, pair.publicKey, kp.publicKey)
    pair.secretKey = kp.secretKey
  } else {
    const masterPair = sr25519PairFromSeed(seed)
    pair = polkadotKeyring.addFromUri(seed)
    pair.secretKey = masterPair.secretKey
  }

  return {
    // this might break address formatting? test against charlie stash address
    address: pair.address,
    pair,
  }
}

/**
 * Derives a key pair from a master key pair using a derivation path.
 *
 * @param {Keypair} signer - The master key pair.
 * @param {string} dervation - The derivation path.
 * @returns {Keypair} The derived key pair.
 */

export function deriveFromMasterPair (signer: Keypair, derivation): Keypair {
  const { path } = keyExtractPath(derivation)
  return keyFromPath(signer, path, 'sr25519')
}
