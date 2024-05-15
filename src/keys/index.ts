import EventEmitter from 'node:events'
import { v4 as uuidv4 } from 'uuid'
import * as utils from './utils'
import {
  EntropyAccount,
  KeyMaterial,
  PairMaterial,
  Seed,
  UIDv4,
} from './types/json'
import {
  ChildKey,
  ChildKeyBasePaths,
  EntropyAccountType,
  EntropyAccountContextType,
} from './types/constants'
import { Signer } from './types/internal'
import { AccountsEmitter } from './types'

/**
 * A utility class to allow consumers of the SDK to subscribe to key creations and "account" updates.
 */
export default class Keyring {
  // private
  // it's a unit8array if it comes from a mnemonic and a string if it comes from the user
  // The seed used to generate keys, can be a Uint8Array (from mnemonic) or a string (user-provided).
  #seed: Uint8Array | string
  accounts: AccountsEmitter
  crypto: Crypto

  /**
   * Initializes a new instance of the `Keyring` class.
   *
   * @param account - The key material and entropy account used for key generation.
   */

  constructor (account: KeyMaterial | EntropyAccount) {

    const { seed, mnemonic } = account as KeyMaterial
    if (!seed && !mnemonic)
      throw new Error('Need at least a seed or mnemonic to create keys')
    if (mnemonic) {
      this.#seed = utils.seedFromMnemonic(mnemonic)
    } else {
      this.#seed = seed
    }
    const accountsJson = this.#formatAccounts(account)
    this.accounts = this.#createFunctionalAccounts(accountsJson)

  }

  /**
   * Derives keys from the entropy account and formats them.
   *
   * @param entropyAccount - The entropy account containing key pair materials.
   */

  #deriveKeys (entropyAccount: EntropyAccount) {
    const accounts = Object.keys(entropyAccount)
    accounts.forEach((keyPairMaterialName: string) => {
      this.#formatAccount(entropyAccount[keyPairMaterialName])
    })
  }

  /**
   * Retrieves the current account information.
   *
   * @returns An object containing the Entropy account details.
   */

  // IMPORTANT!! WE SHOULD DECIDE IF WE WILL ALWAYS BE GENERATING UUID FOR ACCOUNTS OR IF WE
  // WILL ALLOW USERS TO PASS THEIR OWN STRINGS

  getAccount (): EntropyAccount {
    const accounts = {
      type: this.accounts.type || EntropyAccountType.MIXED_ACCOUNT,
    }
    Object.values(ChildKey).forEach((name) => {
      if (!this.accounts[name]) return
      const account: PairMaterial = {
        path: '',
        type: name,
      }
      const { path, seed, verifyingKeys, address } = this.accounts[name]
      if (path) account.path = path
      if (seed) account.seed = seed
      accounts[name] = account
      if (verifyingKeys) account.verifyingKeys = verifyingKeys
      if (address) account.address = address
    })
    return accounts
  }


  #createFunctionalAccounts (masterAccountView: EntropyAccount) {
    const accounts = new EventEmitter() as AccountsEmitter
    accounts.type = accounts.type || EntropyAccountType.MIXED_ACCOUNT
    accounts.asJson = masterAccountView
    Object.keys(masterAccountView).forEach((name) =>{
      if (name) {
        const { seed, derivation, address } = masterAccountView[name]
        if (!seed) throw new TypeError('malformed account: missing seed')
        const functionalAccount = {
          seed,
          derivation,
          address,
          signer: generateKeyPairFromSeed(seed, derivation),
        }
        accounts[name] = functionalAccount
      }
    })
  }


  /**
   * Formats and stores account information.
   *
   * @param account - The pair material for the account.
   */

  #jsonAccountCreator (pairMaterial: unknown, debug): PairMaterial {
    if (!pairMaterial) throw new TypeError('nothing to format please try again')
    const { seed, address, type } = pairMaterial
    const path = debug ? '' : getPath({type, uid: uuidv4()})
    const nonDebugSeed = seed.includes('/') ? seed : `${seed}${path}`
    const jsonAccount = {
      seed: debug? seed : nonDebugSeed
      path,
      address
    }

    return jsonAccount

  }

  #formatAccounts (accounts: PairMaterial | EntropyAccount): EntropyAccount {
    const { seed, mnemonic, debug } = accounts
    const entropyAccountsJson = {
      debug,
      seed: seed ? seed : seedFromMnemonic(mnemonic)
    }

    if (debug) {
      Object.keys(ChildKey).forEach((key) => {
        entropyAccountsJson[key] = this.#jsonAccountCreator({seed: entropyAccountsJson.seed}, debug)
        if (accounts[key] && accounts[key].verifyingKeys ) entropyAccountsJson[key].verifyingKeys = accounts.verifyingKeys
        else entropyAccountsJson[key].verifyingKeys = []
        entropyAccountsJson[key].type = key
        entropyAccountsJson.userContext = EntropyAccountContectType[entropyAccountsJson.type]
      })
      Object.keys(accounts).forEach((key) => {
        if(entropyAccountsJson[type]) return
        entropyAccountsJson[key] = this.#jsonAccountCreator(accounts[key], debug)
        if (accounts[key] && accounts[key].verifyingKeys ) entropyAccountsJson[key].verifyingKeys = accounts.verifyingKeys
        else entropyAccountsJson[key].verifyingKeys = []
        entropyAccountsJson[key].type = key
        entropyAccountsJson.userContext = EntropyAccountContectType[entropyAccountsJson.type]
      })
    } else {
      Object.keys(ChildKey).forEach((key) => {
        entropyAccountsJson[key] = this.#jsonAccountCreator({seed: entropyAccountsJson.seed, key}, debug)
        if (accounts[key] && accounts[key].verifyingKeys ) entropyAccountsJson[key].verifyingKeys = accounts.verifyingKeys
        else entropyAccountsJson[key].verifyingKeys = []
        entropyAccountsJson[key].type = key
        entropyAccountsJson.userContext = EntropyAccountContextType[entropyAccountsJson.type]
      })
      Object.keys(accounts).forEach((key) => {
        if(entropyAccountsJson[type]) return
        entropyAccountsJson[key] = this.#jsonAccountCreator(accounts[key], debug)
        if (accounts[key] && accounts[key].verifyingKeys ) entropyAccountsJson[key].verifyingKeys = accounts.verifyingKeys
        else entropyAccountsJson[key].verifyingKeys = []
        entropyAccountsJson[key].type = key
        entropyAccountsJson.userContext = EntropyAccountContectType[entropyAccountsJson.type]
      })
    }
    return entropyAccountsJson
  }

  /**
   * Retrieves the registering key for signing.
   *
   * @returns A `Signer` object for registration.
   */

  getRegisteringKey (): Signer {
    const type = ChildKey.REGISTRATION
    if (this.accounts[ChildKey.REGISTRATION]) {
      return this.accounts[ChildKey.REGISTRATION].signer
    }
    this.#createKey({ type, uuid: uuidv4() })
    return this.accounts[ChildKey.REGISTRATION].signer
  }

  /**
   * Retrieves the device key for signing.
   *
   * @returns A `Signer` object for the device key.
   */

  getDeviceKey (): Signer {
    const type = ChildKey.DEVICE_KEY
    if (this.accounts[ChildKey.DEVICE_KEY]) {
      return this.accounts[ChildKey.DEVICE_KEY].signer
    }
    this.#createKey({ type, uuid: uuidv4() })
    return this.accounts[ChildKey.DEVICE_KEY].signer
  }

  /**
   * Retrieves the program development key for signing.
   *
   * @returns A `Signer` object for program development.
   */

  getProgramDevKey (): Signer {
    const type = ChildKey.PROGRAM_DEV
    console.log('accounts:', this.accounts, this.getAccount())
    if (this.accounts[ChildKey.PROGRAM_DEV]) {
      return this.accounts[ChildKey.PROGRAM_DEV].signer
    }
    this.#createKey({ type })
    return this.accounts[ChildKey.PROGRAM_DEV].signer
  }

  getChildSigner (childKey: ChildKey): Signer {
    switch (childKey) {
    case ChildKey.DEVICE_KEY:
      return this.getDeviceKey()
    case ChildKey.REGISTRATION:
      return this.getRegisteringKey()
    case ChildKey.PROGRAM_DEV:
      return this.getProgramDevKey()
    default:
      throw new Error(`unknown child key: ${childKey}`)
    }
  }

  /**
   * Lazily loads a key proxy for a given type.
   * This is so we dont just generate a bunch of useless keys that are getting
   * stored for no reason
   * @param type - The type of the key.
   * @returns A `Signer` proxy object.
   */

  getLazyLoadKeyProxy (childKey: ChildKey): Signer {
    console.log('childKey!!!!', childKey)
    // if (!this.accounts[childKey]) {
    //   this.accounts[childKey] = {}
    // }
    return new Proxy(this.accounts || {}, {
      get: (account, key) => {
        const signer = this.getChildSigner(childKey)
        if (key === 'verifyingKeys') {
          return signer.verifyingKeys || []
        }
        return signer
      },
      set: (_, key, value) => {
        this.accounts[key] = value
        if (key === 'verifyingKeys') this.accounts.emit('account-update')
        return value
      },
    })
  }

  /**
   * Creates a new key and formats the account.
   *
   * @param params - The parameters for key creation.
   * @param params.type - The type of the key.
   * @param params.uuid - The UUID for the key.
   */

  #createKey ({ type, uuid }: { type: ChildKey; seed?: Seed; uuid?: UIDv4 }) {
    console.log('uuid', uuid)
    const path = uuid
      ? `${ChildKeyBasePaths[type]}${uuid}`
      : ChildKeyBasePaths[type]
    console.log('Constructed path:', path)
    this.#formatAccount({ path, type })
    this.accounts[type] = this.accounts.emit(
      'account-update',
      this.getAccount()
    )
  }
}
