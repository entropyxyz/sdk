import { sr25519PairFromSeed, cryptoWaitReady } from '@polkadot/util-crypto'
import Keyring from '@polkadot/keyring'
import { Signer } from '../types'


/**
 * This module provides utility functions for generating and managing wallets in the Polkadot ecosystem.
 */

/**
 * Generates a wallet using a given seed.
 * 
 * @function getWallet
 * @param {string} seed - The seed string used to generate the wallet.
 * @returns {Promise<Signer>} - A promise that resolves to a Signer object containing the wallet and its associated key pair.
 */

export const getWallet = async (seed: string): Promise<Signer> => {
  // Initialize a keyring for sr25519 cryptography.
  const keyring = new Keyring({ type: 'sr25519' })
  // Wait for the crypto library to be ready. 
  await cryptoWaitReady()
  // Generate a key pair from the provided seed.
  const pair = sr25519PairFromSeed(seed)
  // Add the generated key pair to the keyring.
  const wallet = keyring.addFromPair(pair)
  return { wallet, pair }
}
