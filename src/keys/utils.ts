import { Keypair } from '@polkadot/util-crypto/types'
import { Keyring as PolkadotKeyring } from '@polkadot/keyring'
import { crypto } from '../utils/crypto'
import { UIDv4 } from './types/json'
import { Pair } from './types/internal'
import { sr25519PairFromSeed } from '@polkadot/util-crypto'

export const UIDv4regex =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i

const {
  // sr25519PairFromSeed,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
} = crypto.polkadotCrypto

/**
 * Converts a mnemonic phrase to a mini secret seed.
 *
 * @param {string} m - The mnemonic phrase.
 * @returns {Promise<Uint8Array>} The mini secret seed.
 */

export function seedFrommnemonic (m) {
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

export function getPath ({ type, uid }: { type: string; uid: UIDv4 }): string {
  if (UIDv4regex.test(uid)) {
    return `//entropy//${type}///${uid}`
  }
  throw new TypeError(
    'uid is not correct type please provide the correct regex matching string'
  )
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
  const polkadotKeyring = new PolkadotKeyring()
  if (derivation) {
    const masterPair = sr25519PairFromSeed(seed)
    const { path } = keyExtractPath(derivation)
    const kp = keyFromPath(masterPair, path, 'sr25519')
    pair = polkadotKeyring.addFromPair(kp)
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
