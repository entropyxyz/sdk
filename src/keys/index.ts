import EventEmitter from 'node:events'
import * as utils from './utils'
import { EntropyAccount, KeyMaterial, PairMaterial } from './types/json'
import {
  ChildKey,
  EntropyAccountType,
  EntropyAccountContextType,
} from './types/constants'
import { Signer } from './types/internal'
import { AccountsEmitter } from './types'

const ACCOUNTS = Object.keys(ChildKey).map((name) => ChildKey[name])

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
    this.#used = []
    Object.keys(account).forEach((key) => {
      if (typeof account[key] === 'object' && account[key].userContext) {
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
    const entropyAccount = { debug, seed, type, verifyingKeys }
    this.#used.forEach((accountName) => {
      entropyAccount[accountName] = this.accounts.masterAccountView[accountName]
    })
    return entropyAccount
  }

  #createFunctionalAccounts (
    masterAccountView: EntropyAccount
  ): AccountsEmitter {
    const accounts = new EventEmitter() as AccountsEmitter
    accounts.type = accounts.type || EntropyAccountType.MIXED_ACCOUNT
    Object.keys(masterAccountView).forEach((name) => {
      if (name) {
        if (typeof masterAccountView[name] !== 'object') return
        const { seed, path, address } = masterAccountView[name]
        if (!seed) return
        const { pair } = utils.generateKeyPairFromSeed(seed, path)
        const functionalAccount = {
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
   * Formats and stores account information.
   *
   * @param account - The pair material for the account.
   */

  #jsonAccountCreator (pairMaterial: PairMaterial, debug): PairMaterial {
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

  #formatAccounts (accounts: EntropyAccount): EntropyAccount {
    const { seed, mnemonic, debug, type } = accounts
    const entropyAccountsJson = {
      debug,
      seed: seed ? seed : utils.seedFromMnemonic(mnemonic),
      type,
    }
    Object.keys(accounts)
      .concat(ACCOUNTS)
      .forEach((key) => {
        let account: PairMaterial
        if (entropyAccountsJson[key]) return
        if (accounts[key] && accounts[key].userContext) account = accounts[key]
        else if (ChildKey[key]) account = { type: ChildKey[key], seed }
        if (!account) return
        entropyAccountsJson[key] = this.#jsonAccountCreator(account, debug)
      })
    return entropyAccountsJson as EntropyAccount
  }

  // #createSingleEntropyAccount (key: ChildKey | string): PairMaterial {
  // entropyAccountsJson[key] = this.#jsonAccountCreator({seed: entropyAccountsJson.seed, key}, debug)
  // if (account && account.verifyingKeys ) entropyAccountsJson[key].verifyingKeys = accounts.verifyingKeys
  // else entropyAccountsJson[key].verifyingKeys = []
  // entropyAccountsJson[key].type = key
  // entropyAccountsJson[key].userContext = EntropyAccountContextType[key]
  // }

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
      set: (account, k: string, v) => {
        if (k === 'used') {
          this.#used.push(childKey)
          if (this.accounts[childKey].used)
            this.accounts.emit(`${childKey}#new`, this.getAccount())
        } else {
          this.accounts.emit(`${childKey}#account-update`, this.getAccount())
        }
        this.accounts.masterAccountView[childKey][k] = v
        return (this.accounts[childKey][k] = v)
      },
    })
  }
}
