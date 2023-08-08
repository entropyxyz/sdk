import { sr25519PairFromSeed, cryptoWaitReady } from '@polkadot/util-crypto'
import Keyring from '@polkadot/keyring'
import { Signer } from '../types'

export const getWallet = async (seed: string): Promise<Signer> => {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)
  return { wallet, pair }
}
