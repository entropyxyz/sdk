import { sr25519PairFromSeed, cryptoWaitReady, mnemonicToMiniSecret, keyFromPath, keyExtractPath } from '@polkadot/util-crypto'
import { hexToU8a} from '@polkadot/util'
import Keyring from '@polkadot/keyring'
import {  Signer, EntropyAccount } from '../types'
import { Keypair} from '@polkadot/util-crypto/types'


export const getWallet = async (seed: string): Promise<Signer> => {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)

  return { 
    wallet, 
    pair 
  }
}
export async function generateKeysFromMnemonic (mnemonic: string): Promise<Signer> {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const seed = mnemonicToMiniSecret(mnemonic)
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)

  return { 
    wallet, 
    pair 
  }
}

export async function generateEntropyAccountFromSeed (seed: string): Promise<EntropyAccount> {
  await cryptoWaitReady()

  // convert seed to a mini secret (private key)
  const miniSecret = mnemonicToMiniSecret(seed)

  // generate the keypair from the mini secret
  const keyPair = sr25519PairFromSeed(miniSecret)

  const sigRequestKeypair: Keypair = {
    publicKey: keyPair.publicKey,
    secretKey: miniSecret
  }

  return {
    sigRequestKeyPair: sigRequestKeypair
  }
}

export async function generateEntropyAccountFromSeeds (sigSeed: string, progSeed: string): Promise<EntropyAccount> {
  await cryptoWaitReady()

  // convert seed strings to mini secrets (private keys)
  const sigMiniSecret = mnemonicToMiniSecret(sigSeed)
  const progMiniSecret = mnemonicToMiniSecret(progSeed)

  // generate key pairs from the mini secrets
  const sigRequestKeyPair = sr25519PairFromSeed(sigMiniSecret)
  const programModificationKeyPair = sr25519PairFromSeed(progMiniSecret)

  // make Keypair objects
  const sigRequestKeypair: Keypair = {
    publicKey: sigRequestKeyPair.publicKey,
    secretKey: sigMiniSecret
  }

  const programModificationKeypair: Keypair = {
    publicKey: programModificationKeyPair.publicKey,
    secretKey: progMiniSecret
  }

  return {
    sigRequestKeyPair: sigRequestKeypair,
    programModificationKeyPair: programModificationKeypair
  }
}

export async function generateKeysFromPrivateKey (privateKey: string): Promise<Signer> {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const seed = hexToU8a(privateKey) // convert hex private key to Uint8Array 
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)

  return { 
    wallet, 
    pair 
  }
}
 
export async function deriveNewKeysFromMnemonic (mnemonic: string, derivationPath: string): Promise<Signer> {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
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