import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
} from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'
import { hexToU8a } from '@polkadot/util'
import { Signer } from '../types'

/**
 * Checks if the provided object is a valid `Signer` pair.
 *
 * @param pair - The `Signer` object to be validated.
 * @returns A boolean indicating whether the provided object is a valid `Signer` pair.
 */

export function isValidPair (pair: Signer): boolean {
  if (!pair) return false
  if (typeof pair !== 'object') return false
  if (!pair.pair.publicKey) return false
  if (!pair.pair.secretKey) return false
  if (!ArrayBuffer.isView(pair.pair.publicKey)) return false
  if (!ArrayBuffer.isView(pair.pair.secretKey)) return false
  if (pair.pair.secretKey.length !== 64) return false
  if (pair.pair.publicKey.length !== 32) return false
  return true
}

/**
 *  Function to create a function that retrieves a wallet from a `Signer` object or a seed string.
 *
 * @returns A function that takes a `Signer` or seed string and returns a Promise resolving to an object containing the wallet and its associated `Signer`.
 */

function setupGetWallet (): (input: string) => Promise<Signer | undefined> {
  const keyring = new Keyring({ type: 'sr25519' })

  return async (input: string): Promise<Signer | undefined> => {
    // do a string typecheck
    if (typeof input === 'string') {
      await cryptoWaitReady()
      const seed = hexToU8a(input)
      const pair = sr25519PairFromSeed(seed)
      const wallet = keyring.addFromPair(pair)
      return { wallet, pair }
    } else {
      throw new Error('input is not a string')
    }
  }
}

/**
 * Retrieves a wallet from a `Signer` object or a seed string.
 *
 * @param pair - A `Signer` object or a seed string.
 * @returns A Promise resolving to an object containing the wallet and its associated `Signer`, or undefined if the input is invalid.
 */

export const getWallet: (
  input: string
) => Promise<Signer | undefined> = setupGetWallet()

/**
 * Generates a new mnemonic phrase or derives a wallet from an existing mnemonic and an optional derivation path.
 *
 * @param mnemonic - Optional. The mnemonic phrase to derive the wallet from. If not provided, a new one is generated.
 * @param derivationPath - Optional. The derivation path to use with the provided mnemonic.
 * @returns A Promise resolving to a `Signer` object containing the generated or derived wallet and its associated key pair.
 */

export async function mnemonicGenOrDerive (
  mnemonic?: string,
  derivationPath?: string
): Promise<Signer> {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })

  if (!mnemonic) {
    mnemonic = mnemonicGenerate()
  }

  const seed = mnemonicToMiniSecret(mnemonic)
  let pair

  if (derivationPath) {
    const masterPair = sr25519PairFromSeed(seed)
    const { path } = keyExtractPath(derivationPath)
    pair = keyFromPath(masterPair, path, 'sr25519')
  } else {
    pair = sr25519PairFromSeed(seed)
  }
  const wallet = keyring.addFromPair(pair)
  return {
    wallet,
    pair,
  }
}
