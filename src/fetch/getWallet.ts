import { sr25519PairFromSeed, cryptoWaitReady } from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'
import { Signer } from '../types/substrate'


/**
 * @alpha
 *
 * @remarks
 * This function is part of the {@link Substrate} class
 *
 * @param {string} seed - the private key of the wallet
 * @returns {*}  {@link Signer} - a signer object for the user talking to the Entropy blockchain
 */
export const getWallet = async (seed: string): Promise<Signer> => {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)
  return { wallet, pair }
}

// base implementation of Signer in Substrate types 