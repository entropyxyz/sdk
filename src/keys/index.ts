import { sr25519PairFromSeed, cryptoWaitReady, mnemonicToMiniSecret, mnemonicGenerate, keyFromPath, keyExtractPath } from '@polkadot/util-crypto'
import { Keyring} from '@polkadot/keyring'
import {  Signer } from '../types'


// seed is hexstring 
export const getWallet = async (seed: string): Promise<Signer> => {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)

  return { 
    wallet, 
    pair 
  }
}
export async function mnemonicGenOrDerive (mnemonic?: string, derivationPath?: string): Promise<Signer> {
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
    pair
  }
}


