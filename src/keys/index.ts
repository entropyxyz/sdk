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
  REGISTRATION = 'registration',
  PROGRAM_DEV = 'program-dev',
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
      this.#seed = seedFromMnemonic(mnemonic)
    } else {
      this.#seed = seed
    }
    if (Object.keys(account).length > 2) this.#deriveKeys(account)
  }
  /**
   * formats account json onto the class*/
  #deriveKeys (entropyAccount: EntropyAccount) {
    const accounts = Object.keys(entropyAccount)
    accounts.forEach((keyPairMaterialName: string) => {
      this.#formatAccount({name: keyPairMaterialName, account: entropyAccount[keyPairMaterialName]})
    })
  }

  getAccount (): EntropyAccount {
    const accounts = {}
    ChildKey.forEach((name) => {
      const account = {}
      const { path, seed, verfiyingKeys, address, type } = this.accounts[name]
      if (path) account.path = path
      if (seed) account.seed = seed
      if (verfiyingKeys) account.verfiyingKeys = verfiyingKeys
      if (address) account.address = address
      account.type = name
      accounts[name] = account
    })
    return accounts
  }

  #formatAccount (account: PairMaterial) {
    const name = account.type
    const dervationPath = account.path
    const seed = account.seed
    const verfiyingKeys = account.verfiyingKeys
    this.accounts[name] = generateKeyPairFromSeed(seed || this.#seed, dervationPath)
    this.accounts[name].path = dervationPath
    if (seed) this.accounts[name].seed = seed
    if (verfiyingKeys) this.accounts[name].verfiyingKeys = verfiyingKeys
    this.accounts[name].type = name
  }
  // internal to the sdk should not necissarl be advertised but can be used by consumers
  getRegisteringKey (): Signer {
    const type = ChildKey.REGISTRATION
    if (this.accounts[ChildKey.REGISTRATION]) return this.accounts[ChildKey.REGISTRATION].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.REGISTRATION].signer
  }

  getDeviceKey (): Signer {
    const type = ChildKey.DEVICE_KEY
    if (this.accounts[ChildKey.DEVICE_KEY]) return this.accounts[ChildKey.DEVICE_KEY].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.DEVICE_KEY].signer
  }

  getProgramDevKey (): Signer {
    const type = ChildKey.PROGRAM_DEV
    if (this.accounts[ChildKey.PROGRAM_DEV]) return this.accounts[ChildKey.PROGRAM_DEV].signer
    this.#creatKey({type})
    return this.accounts[ChildKey.PROGRAM_DEV].signer
  }

  #createKey ({seed=this.#seed, type, uuid}: {type: ChildKey, seed?: Seed, uuid?: UIDv4}) {
    const path = uuid ? `${ChildKeyBasePaths[type]}${uuidv4()}` : ChildKeyBasePaths[type]
    this.#formatAccount({ path, type })
    this.accounts.emmit('account-update', this.getAccount())
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