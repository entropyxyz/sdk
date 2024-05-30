import EventEmitter from 'node:events'
import { deepCopy } from '../utils/housekeeping'
import * as utils from './utils'
import { EntropyAccount, KeyMaterial, PairMaterial } from './types/json'
import {
  ChildKey,
  EntropyAccountType,
  EntropyAccountContextType,
} from './types/constants'
import { Signer } from './types/internal'
import { AccountsEmitter } from './types'

// Whats the point of remapping here?
// .map of object.keys is same as object.values, and either way the
// result is the same considering the enum keys are the values as well
const ACCOUNTS = Object.keys(ChildKey)

/**
 * A utility class to allow consumers of the SDK to subscribe to key creations and "account" updates.
 */
export default class Keyring {
  // private
  // it's a unit8array if it comes from a mnemonic and a string if it comes from the user
  // The seed used to generate keys, can be a Uint8Array (from mnemonic) or a string (user-provided).
  #seed: Uint8Array | string
  #used: string[]
  accounts: AccountsEmitter
  crypto: Crypto

  /**
   * Initializes a new instance of the `Keyring` class.
   *
   * @param account - The key material and entropy account used for key generation.
   */

  constructor (account: KeyMaterial) {
    // this repersents keys that are used by the user
    this.#used = ['admin', ChildKey.registration]
    Object.keys(account).forEach((key) => {
      if (typeof account[key] === 'object' && account[key].userContext) {
        this.#used.push(key)
      } else if ((account as EntropyAccount).debug) {
        this.#used.push(key)
      }
    })
    const { seed, mnemonic } = account
    if (!seed && !mnemonic)
      throw new Error('Need at least a seed or mnemonic to create keys')
    if (mnemonic) {
      this.#seed = utils.seedFromMnemonic(mnemonic)
    } else {
      this.#seed = seed
    }
    const accountsJson = this.#formatAccounts(account)
    this.accounts = this.#createFunctionalAccounts(accountsJson)
    this.accounts.masterAccountView = accountsJson
  }

  #formatAccounts (accounts: EntropyAccount): EntropyAccount {

    const { seed, type, admin } = accounts
    const debug = true
    const entropyAccountsJson = {
      debug,
      // previously was seed ? seed : utils.seedFromMnemonic(mnemonic) but this has already been derived in the constructor
      // @frankie correct if im wrong here
      seed: this.#seed,
      type,
      admin,
    }


    Object.keys(accounts)
      .concat(ACCOUNTS)
      .forEach((key) => {

        let account: PairMaterial
        if (entropyAccountsJson[key]) return
        if (key === ChildKey.registration && admin?.seed) {
          if (accounts[key]) {
            account = { ...admin, ...accounts[key] }
          } else {
            account = admin
          }

          entropyAccountsJson[key] = this.#jsonAccountCreator(account, debug)
          return
        }
        if (accounts[key] && accounts[key].userContext) account = accounts[key]
        else if (ChildKey[key]) account = { type: ChildKey[key], seed }
        if (!account) return
        entropyAccountsJson[key] = this.#jsonAccountCreator(account, debug)
      })
    if (!admin) entropyAccountsJson.admin = entropyAccountsJson[ChildKey.registration]

    return entropyAccountsJson as EntropyAccount
  }

  /**
   * Formats and stores account information.
   *
   * @param account - The pair material for the account.
   */

  #jsonAccountCreator (
    pairMaterial: PairMaterial,
    debug: boolean
  ): PairMaterial {
    if (!pairMaterial) throw new TypeError('nothing to format please try again')
    const {
      seed,
      address,
      type,
      userContext,
      verifyingKeys = [],
      path,
    } = pairMaterial
    const derivation = path || debug ? '' : utils.getPath(type)

    const jsonAccount = {
      seed: seed,
      path: derivation,
      address,
      type,
      verifyingKeys,
      userContext: userContext || EntropyAccountContextType[type],
    }

    return jsonAccount
  }

  #createFunctionalAccounts (
    masterAccountView: EntropyAccount
  ): AccountsEmitter {

    const accounts = new EventEmitter() as AccountsEmitter
    accounts.type = accounts.type || EntropyAccountType.MIXED_ACCOUNT
    Object.keys(masterAccountView).forEach((name) => {
      if (name) {
        if (typeof masterAccountView[name] !== 'object') return
        const { seed, path, ...accountData } = masterAccountView[name]
        if (!seed) return
        const { pair, address } = utils.generateKeyPairFromSeed(seed, path)
        const functionalAccount = {
          ...accountData,
          seed,
          path,
          address,
          pair,
        }
        accounts[name] = functionalAccount
      }
    })
    accounts.masterAccountView = masterAccountView
    return accounts
  }

  /**
   * Retrieves the current account information.
   *
   * @returns An object containing the Entropy account details.
   */

  // IMPORTANT!! WE SHOULD DECIDE IF WE WILL ALWAYS BE GENERATING UUID FOR ACCOUNTS OR IF WE
  // WILL ALLOW USERS TO PASS THEIR OWN STRINGS

  getAccount (): EntropyAccount {
    const { debug, seed, type, verifyingKeys } = this.accounts.masterAccountView
    const entropyAccount: EntropyAccount = { debug, seed, type, verifyingKeys }
    this.#used.forEach((accountName) => {
      if (this.accounts[accountName] === undefined) return
      entropyAccount[accountName] = deepCopy(this.accounts[accountName] as PairMaterial)
    })
    entropyAccount.admin = entropyAccount.registration
    return entropyAccount
  }

  /**
   * Lazily loads a key proxy for a given type.
   * This is so we dont just generate a bunch of useless keys that are getting
   * stored for no reason
   * @param type - The type of the key.
   * @returns A `Signer` proxy object.
   */

  getLazyLoadAccountProxy (childKey: ChildKey): Signer {
    // if (!this.accounts[childKey]) {
    //   this.accounts[childKey] = {}
    // }
    return new Proxy(this.accounts[childKey], {
      get: (_, key: string) => this.accounts[childKey][key],
      set: (_, k: string, v) => {
        if (k === 'used' && !this.accounts[childKey].used) {
          this.#used.push(childKey)
        }
        this.accounts[childKey][k] = v
        this.accounts.masterAccountView[childKey][k] = v
        setTimeout(
          () => this.accounts.emit(`account-update`, this.getAccount()),
          10
        )
        return v
      },
    })
  }
}
