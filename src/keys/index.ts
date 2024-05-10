/**
 * A utility class to allow consumers of the sdk to subscribe
 * to key creations and "account" updates
 */

import EventEmitter from 'node:events'
import { v4 as uuidv4 } from 'uuid'
import { Keypair } from '@polkadot/util-crypto/types'
import * as utils from './utils'
import { EntropyAccount, KeyMaterial, PairMaterial, Seed, UIDv4 } from './types/json'
import { ChildKey, ChildKeyBasePaths } from './types/constants'
import { Signer } from './types/internal'

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


  /**
   * Retrieves account information from an internal data structure and creates a new object with the account details.
   *
   * @returns {EntropyAccount} An object containing the account information, where
   *   the keys correspond to the values of the `ChildKey` enum, and the values
   *   have the following properties:
   *     - path (string): The path associated with the account.
   *     - seed (string, optional): The seed associated with the account.
   *     - verifyingKeys (any, optional): The verifying keys associated with the account.
   *     - address (string, optional): The address associated with the account.
   *     - type (string): The type of the account (same as the key).
   */
  getAccount (): EntropyAccount {
    const accounts = {}
    Object.values(ChildKey).forEach((name) => {
      const account: PairMaterial = {
        path: '',
        type: name,
      };
      const { path, seed, verfiyingKeys, address, type } = this.accounts[name]
      if (path) account.path = path
      if (seed) account.seed = seed
      if (verfiyingKeys) account.verifyingKeys = verfiyingKeys
      if (address) account.address = address
      accounts[name] = account
    })
    return accounts
  }


  /**
   * Formats the account information and stores it in the internal `this.accounts` object.
   *
   * @param {PairMaterial} account - The account object containing the account information.
   * @param {string} account.type - The type of the account.
   * @param {string} account.path - The derivation path of the account.
   * @param {string} [account.seed] - The seed associated with the account (optional).
   * @param {any} [account.verifyingKeys] - The verifying keys associated with the account (optional).
   */
  #formatAccount (account: PairMaterial) {
    const name = account.type
    const derivationPath = account.path
    const seed = account.seed
    const verfiyingKeys = account.verifyingKeys
    this.accounts[name] = utils.generateKeyPairFromSeed(seed || this.#seed.toString(), derivationPath)
    this.accounts[name].path = derivationPath
    if (seed) this.accounts[name].seed = seed
    if (verfiyingKeys) this.accounts[name].verfiyingKeys = verfiyingKeys
    this.accounts[name].type = name
  }


  /**
   * Gets the registering key signer.
   *
   * @internal
   * @note This is an internal function of the SDK and is likely not intended for use by consumer developers.
   *
   * @returns {Signer} The signer for the registering key.
   */
  getRegisteringKey (): Signer {
    const type = ChildKey.REGISTRATION
    if (this.accounts[ChildKey.REGISTRATION]) return this.accounts[ChildKey.REGISTRATION].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.REGISTRATION].signer
  }


  /**
   * Gets the device key signer.
   *
   * @returns {Signer} The signer for the device key.
   */
  getDeviceKey (): Signer {
    const type = ChildKey.DEVICE_KEY
    if (this.accounts[ChildKey.DEVICE_KEY]) return this.accounts[ChildKey.DEVICE_KEY].signer
    this.#createKey({type, uuid: uuidv4()})
    return this.accounts[ChildKey.DEVICE_KEY].signer
  }


  /**
   * Gets the program development key signer.
   *
   * @returns {Signer} The signer for the program development key.
   */
  getProgramDevKey (): Signer {
    const type = ChildKey.PROGRAM_DEV
    if (this.accounts[ChildKey.PROGRAM_DEV]) return this.accounts[ChildKey.PROGRAM_DEV].signer
    this.#createKey({type})
    return this.accounts[ChildKey.PROGRAM_DEV].signer
  }
 

  /**
   * Gets a proxy object that lazily loads the signer for a given key type.
   *
   * This function is used to prevent generating and storing unnecessary keys.
   *
   * @internal
   *
   * @param {string} type - The type of the key to lazily load.
   * @returns {Proxy<Signer>} A proxy object that lazily loads the signer for the specified key type.
   */
  getLazyLoadKeyProxy (type): Signer {
    return new Proxy (this.accounts[type], {
      get: (account, key) =>  this[`get${type}Key`]()
    })
  }

  
  /**
   * Creates a new key.
   *
   * @private
   * @param {Object} options - The options for creating the key.
   * @param {ChildKey} options.type - The type of the key.
   * @param {Seed} [options.seed] - The seed for the key (optional).
   * @param {UIDv4} [options.uuid] - The UUID for the key (optional).
   */
  #createKey ({ type, uuid }: {type: ChildKey, seed?: Seed, uuid?: UIDv4}) {
    const path = uuid ? `${ChildKeyBasePaths[type]}${uuidv4()}` : ChildKeyBasePaths[type]
    this.#formatAccount({ path, type })
    this.accounts.emit('account-update', this.getAccount())
  }

}
