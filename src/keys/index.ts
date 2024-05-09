import EventEmitter from `node:events`
import { v4 as uuidv4 } from 'uuid'
import { Keypair } from '@polkadot/util-crypto/types'
import * as utils from './utils'

/**
 * A utility class to allow consumers of the sdk to subscribe
 * to key creations and "account" updates
 */


export default class Keyring {
  // private
  // it's a unit8array if it comes from a mnemonic and a string if it comes from the user
  #seed: Uint8Array | string
  accounts:
  async constructor (account: KeyMaterial | EntropyAccount) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
    this.accounts = new EventEmitter()
    const { seed, mnemonic } = account
    if (!seed || !mnemonic) throw new Error('Need at least a seed or mnemonic to create keys')
    if (mnemonic) {
      this.#seed = utils.seedFromMnemonic(mnemonic)
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
  // this is so we dont just generate a bunch of useless keys that are getting
  // stored for no reason
  getLazyLoadKeyProxy (type): Signer {
    return new Proxy (this.accounts[type], {
      get: (account, key) =>  this[`get${type}Key`]()
    })
  }

  #createKey ({seed=this.#seed, type, uuid}: {type: ChildKey, seed?: Seed, uuid?: UIDv4}) {
    const path = uuid ? `${ChildKeyBasePaths[type]}${uuidv4()}` : ChildKeyBasePaths[type]
    this.#formatAccount({ path, type })
    this.accounts.emmit('account-update', this.getAccount())
  }

}