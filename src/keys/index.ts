import EventEmitter from `node:events`
import { v4 as uuidv4 } from 'uuid'
import { Keypair } from '@polkadot/util-crypto/types'
import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress
} from '@polkadot/util-crypto'

import { Signer } from '../types'
import { type EntropyAccountJSON} from './types'
import { EntropyAccountType, EntropyWallet, EntropyAccount } from './types'

await cryptoWaitReady()


export const UIDv4regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
export type UIDv4 = string


 // for the device key generate a random number example: `device-key:${uid}`
export function getPath ({type, uid}: {type: string, uid: UIDv4}): string {
  if (UIDv4regex.test(uid)) {
    return `//entropy//${type}///${UIDV4}`
  }
  throw new TypeError('uid is not correct type please provide the correct regex matching string')
}

export enum ChildKey {
  REGISTRATION = 'registration'
  PROGRAM_DEV = 'program-dev'
  DEVICE_KEY = 'device-key'
}

export function createEntropyKeyring (account: EntropyAccountInfo = {}) : EntropyAccount {
  const jsonStore = {...account}
  const keyring = new EventEmitter()
  keyring.toJSON = () => jsonStore

  // create wallet and signer for each seed and dervation path
  let { mnemonic, seed } = account
  if (!seed && !menomnic) account.menomnic = mnemonicGenerate()
  if (!seed) seed = mnemonicToMiniSecret(seed)

  jsonStore.seed = seed
  jsonStore.mnemonic = mnemonic

  switch (account.type) {
    case EntropyAccountType.REGISTERED_ACCOUNT: {
      const path = account.dervationPath || getPath({ type: ChildKey.REGISTRATION, uid: uuidv4()})
      jsonStore.dervationPath = path
    }
    case EntropyAccountType.PROGRAM_DEV_ACCOUNT: {
      const path = account.dervationPath || getPath({ type: ChildKey.REGISTRATION, uid: uuidv4()})
      keyring[ChildKey.PROGRAM_DEV] = generateKeyPairFromSeed(seed, path)
      jsonStore.dervationPath = path
    }
    case EntropyAccountType.CONSUMER_ACCOUNT: {
      const path = account.dervationPath || getPath({ type: ChildKey.REGISTRATION, uid: uuidv4()})
      keyring[ChildKey.DEVICE_KEY] = generateKeyPairFromSeed(seed, path)
      jsonStore.dervationPath = path
    }
    default:
      if (!account.type) account.type = EntropyAccountType.MIXED_ACCOUNT
      keyring[account.type] = generateKeyPairFromSeed(seed)
      break;
  }


  return keyring
}

export function generateSeed (): string {
  const mnemonic = mnemonicGenerate()
  const mnemonicMini = mnemonicToMiniSecret(mnemonic)
}


/**
 * @param seed {@link string}
 * @param derivation {@link string}
 * @returns Signer {@link Signer}
 * generates A usable signer with meta info about the account i.e. address etc
 * */
export function generateKeyPairFromSeed (seed: string, dervation?: string): { address: string; privateKey: string, pair: Signer } {
  let pair
  if (dervation) {
    const masterPair = sr25519PairFromSeed(seed)
    const { path } = keyExtractPath(dervation)
    pair = keyFromPath(masterPair, path, 'sr25519')
  } else {
    pair = sr25519PairFromSeed(seed)
  }


  return {
    // this might break address formatting? test against charlie stash address
    address: encodeAddress(pair.publicKey),
    privateKey: pair.secretKey.toString(),
    signer: pair,
  };
}

export function deriveFromMasterPair (signer: Keypair, dervation): Keypair {
    const { path } = keyExtractPath(dervation)
    return keyFromPath(signer, path, 'sr25519')
}