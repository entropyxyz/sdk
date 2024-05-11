import EventEmitter from 'node:events'
import { v4 as uuidv4 } from 'uuid'
import { Keypair } from '@polkadot/util-crypto/types'
import * as utils from './utils'
import { EntropyAccount, KeyMaterial, PairMaterial, Seed, UIDv4 } from './types/json'
import { ChildKey, ChildKeyBasePaths } from './types/constants'
import { Signer } from './types/internal'

/**
 * A utility class to allow consumers of the sdk to subscribe
 * to key creations and "account" updates
 */


export default class Keyring {
  // private
  // it's a unit8array if it comes from a mnemonic and a string if it comes from the user
  #seed: Uint8Array | string
  accounts: EventEmitter
  crypto: Crypto
  constructor(account: KeyMaterial & EntropyAccount) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
    this.accounts = new EventEmitter()
    const { seed, mnemonic } = account
    if (!seed || !mnemonic) throw new Error('Need at least a seed or mnemonic to create keys')
    const populateSeed = async () => {
      if (mnemonic) {
        this.#seed = await utils.seedFromMnemonic(mnemonic)
      } else {
        this.#seed = seed
      }
    }
    populateSeed()
    if (Object.keys(account).length > 2) this.#deriveKeys(account)
  }
  /**
   * formats account json onto the class*/
  #deriveKeys (entropyAccount: EntropyAccount) {
    const accounts = Object.keys(entropyAccount)
    accounts.forEach((keyPairMaterialName: string) => {
      this.#formatAccount(entropyAccount[keyPairMaterialName])
    })
  }

  getAccount (): EntropyAccount {
    const accounts = {}
    Object.values(ChildKey).forEach((name) => {
      const account: PairMaterial = {
        path: '',
        type: name,
      };
      if (path) account.path = path
      const { path, seed, verifyingKeys, address, type } = this.accounts[name]
      if (seed) account.seed = seed
      accounts[name] = account
      if (verifyingKeys) account.verifyingKeys = verifyingKeys
      if (address) account.address = address
    })
    return accounts
  }

  #formatAccount (account: PairMaterial) {
    const name = account.type
    const derivationPath = account.path
    const seed = account.seed
    this.accounts[name] = utils.generateKeyPairFromSeed(seed || this.#seed.toString(), derivationPath)
    const verifyingKeys = account.verifyingKeys
    this.accounts[name].path = derivationPath
    if (seed) this.accounts[name].seed = seed
  }
    if (verifyingKeys) this.accounts[name].verifyingKeys = verifyingKeys
    this.accounts[name].type = name
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
    this.#createKey({type})
    return this.accounts[ChildKey.PROGRAM_DEV].signer
  }
  // this is so we dont just generate a bunch of useless keys that are getting
  // stored for no reason
  getLazyLoadKeyProxy (type): Signer {
    return new Proxy (this.accounts[type], {
      get: (account, key) =>  {
        const signer = this[`get${type}Key`]()
        if (key === 'verifyingKeys') {
          return signer.verifyingKeys || []
        }
        return signer
      },
      set: (_, key, value) => {
        this.accounts[key] = value
        if (key === 'verifyingKeys') this.accounts.emit('account-update')
        return value
      }
    })
  }

  #createKey ({ type, uuid }: {type: ChildKey, seed?: Seed, uuid?: UIDv4}) {
    const path = uuid ? `${ChildKeyBasePaths[type]}${uuidv4()}` : ChildKeyBasePaths[type]
    this.#formatAccount({ path, type })
    this.accounts.emit('account-update', this.getAccount())
  }

}