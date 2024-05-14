import EventEmitter from 'node:events'
import { v4 as uuidv4 } from 'uuid'
import * as utils from './utils'
import { EntropyAccount, KeyMaterial, PairMaterial, Seed, UIDv4 } from './types/json'
import { ChildKey, ChildKeyBasePaths, EntropyAccountType } from './types/constants'
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
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
    const accounts = new EventEmitter() as AccountsEmitter
    accounts.type = accounts.type || EntropyAccountType.MIXED_ACCOUNT 
    this.accounts = accounts as AccountsEmitter

    const { seed, mnemonic } = account as KeyMaterial
    if (!seed || !mnemonic) throw new Error('Need at least a seed or mnemonic to create keys')
    const populateSeed = async () => {
      if (mnemonic) {
        this.#seed = await utils.seedFrommnemonic(mnemonic)
      } else {
        this.#seed = seed
      }
    }
    populateSeed()
    if (Object.keys(account).length > 2) this.#deriveKeys(account as EntropyAccount)
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

  getAccount (): EntropyAccount {
    const accounts = {
      type: this.accounts.type || EntropyAccountType.MIXED_ACCOUNT
    }
    Object.values(ChildKey).forEach((name) => {
      const account: PairMaterial = {
        path: '',
        type: name,
      }
      const { path, seed, verifyingKeys, address, type } = this.accounts[name]
      if (path) account.path = path
      if (seed) account.seed = seed
      accounts[name] = account
      if (verifyingKeys) account.verifyingKeys = verifyingKeys
      if (address) account.address = address
    })
    return accounts
  }

  /**
   * Formats and stores account information.
   *
   * @param account - The pair material for the account.
   */

  #formatAccount (account: PairMaterial) {
    const name = account.type
    const derivationPath = account.path
    const seed = account.seed
    this.accounts[name] = utils.generateKeyPairFromSeed(seed || this.#seed.toString(), derivationPath)
    const verifyingKeys = account.verifyingKeys
    this.accounts[name].path = derivationPath
    if (seed) this.accounts[name].seed = seed
    if (verifyingKeys) 
      this.accounts[name].verifyingKeys = verifyingKeys 
      this.accounts[name].type = name
  }

  /**
   * Retrieves the registering key for signing.
   *
   * @returns A `Signer` object for registration.
   */
  
  getRegisteringKey (): Signer {
    const type = ChildKey.REGISTRATION
    if (this.accounts[ChildKey.REGISTRATION]) return this.accounts[ChildKey.REGISTRATION].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.REGISTRATION].signer
  }

  /**
   * Retrieves the device key for signing.
   *
   * @returns A `Signer` object for the device key.
   */

  getDeviceKey (): Signer {
    const type = ChildKey.DEVICE_KEY
    if (this.accounts[ChildKey.DEVICE_KEY]) return this.accounts[ChildKey.DEVICE_KEY].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.DEVICE_KEY].signer
  }

  /**
   * Retrieves the program development key for signing.
   *
   * @returns A `Signer` object for program development.
   */

  getProgramDevKey (): Signer {
    const type = ChildKey.PROGRAM_DEV
    if (this.accounts[ChildKey.PROGRAM_DEV]) return this.accounts[ChildKey.PROGRAM_DEV].signer
    this.#createKey({type})
    return this.accounts[ChildKey.PROGRAM_DEV].signer
  }
  
  /**
   * Lazily loads a key proxy for a given type.
   * This is so we dont just generate a bunch of useless keys that are getting
   * stored for no reason
   * @param type - The type of the key.
   * @returns A `Signer` proxy object.
   */

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

  /**
   * Creates a new key and formats the account.
   *
   * @param params - The parameters for key creation.
   * @param params.type - The type of the key.
   * @param params.uuid - The UUID for the key.
   */

  #createKey ({ type, uuid }: {type: ChildKey, seed?: Seed, uuid?: UIDv4}) {
    const path = uuid ? `${ChildKeyBasePaths[type]}${uuidv4()}` : ChildKeyBasePaths[type]
    this.#formatAccount({ path, type })
    this.accounts.emit('account-update', this.getAccount())
  }

}