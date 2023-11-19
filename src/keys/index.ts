import { sr25519PairFromSeed, cryptoWaitReady, mnemonicToMiniSecret, keyFromPath, keyExtractPath } from '@polkadot/util-crypto'
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
// wordlist 
export async function generateKeysFromMnemonic (mnemonic: string): Promise<Signer> {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const seed = mnemonicToMiniSecret(mnemonic)
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)

  return { 
    wallet, 
    pair 
  }
}
// word list 
export async function deriveNewKeysFromMnemonic (mnemonic: string, derivationPath: string): Promise<Signer> {
  await cryptoWaitReady()
  const keyring = new Keyring({ type: 'sr25519' })
  const seed = mnemonicToMiniSecret(mnemonic)
  const masterPair = sr25519PairFromSeed(seed)

  const { path } = keyExtractPath(derivationPath)

  const derivedPair = keyFromPath(masterPair, path, 'sr25519')
  const wallet = keyring.addFromPair(derivedPair)

  return { 
    wallet, 
    pair: derivedPair 
  }
}


