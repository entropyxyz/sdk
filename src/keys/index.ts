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

const ready = cryptoWaitReady()

export enum ChildKey {
  REGISTRATION = 'registration'
  PROGRAM_DEV = 'program-dev'
  DEVICE_KEY = 'device-key'
}



const crypto = new Proxy({
  sr25519PairFromSeed,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress
}, {
  get: async (base, key) => {
    await ready
    return base[key]
  }
})


export const UIDv4regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
export type UIDv4 = string


/**
 * A utility class to allow consumers of the sdk to subscribe
 * to key creations and "account" updates
 */


export default class Keyring {

  async constructor (account: KeyMaterial | EntropyAccount) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
    this.accounts = new EventEmitter()
    const { seed, mnemonic } = account
    if (!seed || !mnemonic) throw new Error('Need at least a seed or mnemonic to create keys')
    if (mnemonic) {
      this.#seed =
    }
    this.#seed = seed
  }


}


export function KeyringToAccount () {

}

export function AccountToKeyRing () {

}

export function createKeyring () {

}

export function createDeviceKey () {

}

export function createAdminKey () {

}

export function createDevKey () {

}

export function

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