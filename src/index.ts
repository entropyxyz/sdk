import { ApiPromise, WsProvider } from '@polkadot/api'
import { SignatureLike } from '@ethersproject/bytes'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet } from './keys'
import SignatureRequestManager, { SigOps, SigTxOps }  from './signing'
import {  crypto } from './utils/crypto' 
import { Adapter } from './signing/adapters/types'
import { Signer, Address } from './types'
import ProgramManager from './programs'

/**
 * Configuration parameters for initializing the Entropy instance.
 * 
 * @typedef EntropyOpts
 * 
 * @property {string} [seed] - The seed for generating the user's keys.
 * @property {string} [endpoint] - The endpoint for connecting to Entropy validators.
 * @property {Object} [adapters] - A collection of adapters for different signature types. i.e ethereum (ECDSA).
 */

/**
 * The `Entropy` class provides an interface for interacting with Entropy.
 * 
 * @class Entropy
 * 
 * @property {Promise<void>} ready - A promise that resolves when the instance is fully initialized.
 * @property {Function} isRegistered - A function to check if an address is registered with Entropy.
 * @property {Signer} keys - Represents the user's keys for interacting with Entropy.
 * @property {RegistrationManager} registrationManager - Manages registration-related operations.
 * @property {ProgramManager} programs - Manages program-related operations. 
 * @property {SignatureRequestManager} signingManager - Manages signature request operations.
 * @property {ApiPromise} substrate - An instance of `ApiPromise` which provides methods to interact with Entropy.
 */

export interface EntropyOpts {
  seed?: string;
  endpoint?: string;
  adapters?: { [key: string | number]: Adapter };
}

export default class Entropy {
  #ready?: (value?: any) => void
  #fail?: (reason?: any) => void
  ready: Promise<void>
  isRegistered: (address: Address) => Promise<boolean>;
  keys?: Signer;
  registrationManager: RegistrationManager;
  programs: ProgramManager
  signingManager: SignatureRequestManager

  substrate: ApiPromise

  /**
   * Initializes the Entropy instance.
   * 
   * @async
   * @private
   * @param {EntropyOpts} opts - Configuration parameters.
   */

  async init (opts: EntropyOpts) {
    this.keys = await getWallet(opts.seed);
    const wsProvider = new WsProvider(opts.endpoint);
  
    const substrate = new ApiPromise({ provider: wsProvider });
    this.substrate = substrate
    this.registrationManager = new RegistrationManager({
      substrate: substrate,
      signer: this.keys,
    });
    this.signingManager = new SignatureRequestManager({
      signer: this.keys,
      substrate,
      adapters: opts.adapters,
      crypto
    });
    this.programs = new ProgramManager({ 
      substrate: substrate,
      signer: this.keys,
    });
    await substrate.isReady;
    this.#ready()
    this.isRegistered = this.registrationManager.checkRegistrationStatus.bind(this.registrationManager)

  }

  /**
   * Creates an instance of the Entropy class.
   * 
   * @constructor
   * @param {EntropyOpts} opts - Configuration parameters for initializing the Entropy instance.
   */

  constructor (opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })


    this.init(opts).catch((error) => {
      this.#fail(error);
    })
  }

  /**
   * Registers a user w/ Entropy.
   * 
   * @async
   * @param {RegistrationParams} params - Registration parameters.
   * @returns {Promise<void>}
   * 
   * @throws Will throw an error if the provided address is a not valid Substrate address.
   */

  async register (params: RegistrationParams) {
    await this.ready
    console.log('I AM READY!!!!')
    if (params.address) {
      if (!isValidSubstrateAddress(params.address)) {
        throw new TypeError('Incompatible address type')
      }
    }
    console.log('im goint to register')
    return this.registrationManager.register(params)
  }

  /**
   * Signs a transaction using Entropy.
   * 
   * @async
   * @param {SigTxOps} params - Parameters for signing the transaction.
   * @returns {Promise<SignatureLike>}
   */

  async signTransaction (params: SigTxOps): Promise<SignatureLike> {
    await this.ready
    return this.signingManager.signTransaction(params)
  }

  /**
   * Signs a request using Entropy.
   * 
   * @async
   * @param {SigOps} params - Parameters for signing the request.
   * @returns {Promise<SignatureLike>}
   */

  async sign (params: SigOps): Promise<SignatureLike> {
    await this.ready
    return this.signingManager.sign(params)
  }
}

