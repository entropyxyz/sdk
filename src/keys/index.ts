import { sr25519PairFromSeed, cryptoWaitReady, mnemonicToMiniSecret, mnemonicGenerate, keyFromPath, keyExtractPath } from '@polkadot/util-crypto'
import { Keyring} from '@polkadot/keyring'
import {  Signer } from '../types'


export function isValidPair (pair): boolean {
 if (!pair) return false
 if (typeof pair !== 'object') return false
 if (!pair.publicKey) return false
 if (!pair.secretKey) return false
 if (!ArrayBuffer.isView(pair.publicKey)) return false
 if (!ArrayBuffer.isView(pair.secretKey)) return false
 if (pair.secretKey.length !== 64) return false
 if (pair.publicKey.length !== 32) return false
 return true
}

//  crete closure


function setupGetWallet (): () => Signer | undefined {
  const keyring = new Keyring({ type: 'sr25519' })
  return (pair) => {
    if (!pair) return undefined
    const wallet = keyring.addFromPair(pair)
    return {
      wallet,
      pair
    }
  }
}

export const getWallet: () => Signer | undefined = setupGetWallet()

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


