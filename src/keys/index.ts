import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
} from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/keyring'
import { KeyringPair } from '@polkadot/keyring/types'
import { hexToU8a } from '@polkadot/util'
import { Signer } from '../types'

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


function setupGetWallet (): (input: Signer | string) => Promise<{ wallet: KeyringPair, pair: Signer }> | undefined {
  const keyring = new Keyring({ type: 'sr25519' })

  return async (input: Signer | string) => {
    let processedPair: Signer

    // do a string typecheck 
    if (typeof input === 'string') {
      await cryptoWaitReady() 
      const seed = hexToU8a(input)
      const sr25519Pair = sr25519PairFromSeed(seed)
      const keyringPair = keyring.addFromPair(sr25519Pair)
      processedPair = { wallet: keyringPair, pair: sr25519Pair } 
    } else if (input && 'pair' in input) {
      // If input is already a Signer object use it 
      processedPair = input
    } else {
      return undefined
    }

    const wallet = keyring.addFromPair(processedPair.pair)
    return {
      wallet,
      pair: processedPair,
    }
  }
}

export const getWallet: (pair: Signer | string) => Promise<{ wallet: KeyringPair, pair: Signer }> | undefined = setupGetWallet()

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
