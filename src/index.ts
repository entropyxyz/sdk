import { ApiPromise, WsProvider } from '@polkadot/api'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet,deriveFromMnemonic, generateFromMnemonic } from './keys'
import SignatureRequestManager, { SigOps, SigTxOps } from './signing'
import { crypto } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import { Signer, Address } from './types'
import ProgramManager from './programs'

export interface KeyOptions {
  seed?: string
  mnemonic?: string
  sigSeed?: string
  progSeed?: string
  derivationPath?: string
}

export interface EntropyOpts {
  /** seed for wallet initialization. */
  keyOptions?: KeyOptions
  /** local or devnet endpoint for establishing a connection to validators */
  endpoint?: string
  /** A collection of signing adapters. */
  adapters?: { [key: string | number]: Adapter }
}


/**
 *
 * @remarks
 * The main interface for users wanting to interact with Entropy.
 * This class provides methods to register, check registration status,
 * and sign transactions.
 * Users can await the `ready` promise to ensure that the class has been initialized
 * before performing operations.
 * 
 * @example
 * ```typescript
 * const entropy = new Entropy({ seed: 'SEED', endpoint: 'wss://localhost:8080' })
 * await entropy.ready
 * await entropy.register({ address, keyVisibility: 'Permissioned', freeTx: false })
 * ```
 * @alpha
 */

export default class Entropy {
  #ready?: (value?: unknown) => void
  #fail?: (reason?: unknown) => void

  /** A promise that resolves once chacha20poly1305 cryptoLib has been loaded */
  ready: Promise<void>
  keys?: Signer
  registrationManager: RegistrationManager
  isRegistered: (address: Address) => Promise<boolean>
  programs: ProgramManager
  signingManager: SignatureRequestManager

  substrate: ApiPromise

  async init (opts: EntropyOpts) {
    const keys = opts.keyOptions

    if (keys?.seed) {
      this.keys = await getWallet(keys.seed)
    } else if (keys?.mnemonic && keys?.derivationPath) {
      this.keys = await deriveFromMnemonic(keys.mnemonic, keys.derivationPath)
    } else if (keys?.mnemonic) {
      this.keys = await generateFromMnemonic(keys.mnemonic)
    } else {
      throw new Error("Insufficient data provided for key generation")
    }

    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReady

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: this.keys,
    })
    this.signingManager = new SignatureRequestManager({
      signer: this.keys,
      substrate: this.substrate,
      adapters: opts.adapters,
      crypto,
    })
    this.programs = new ProgramManager({
      substrate: this.substrate,
      signer: this.keys,
    })

    this.#ready()
    this.isRegistered = this.registrationManager.checkRegistrationStatus.bind(this.registrationManager)
  }

  constructor (opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })

    this.init(opts).catch((error) => {
      this.#fail(error)
    })
  }

  /**
   * Registers an address to Entropy using the provided parameters.
   *
   * @param registrationParams - Parameters for registration, including:
   *   - `address`: The address to register
   *   - `keyVisibility`: The visibility setting for the key. "Private" | "Public" | "Permissioned"
   *   - `initialProgram`: (optional for now) Initial program setting. TODO // update to reflect new settings
   * @returns A promise indicating the completion of the registration process.
   * @throws {TypeError} Throws if the provided address format is not compatible.
   * @throws {Error} Throws if the address being registered is already in use.
   */

  async register (params: RegistrationParams): Promise<undefined> {
    await this.ready
    if (params.programModAccount) {
      if (!isValidSubstrateAddress(params.programModAccount)) {
        throw new TypeError('Incompatible address type')
      }
    }
    return this.registrationManager.register(params)
  }
  
  /**
   * Signs a given transaction based on the provided parameters.
   * 
   * The `signTransaction` method invokes the appropriate adapter (chain based configuration) 
   * based on the type specified in the `params`. This modular approach ensures that various 
   * transaction types can be supported. The method performs a series of operations, starting 
   * with the `preSign` function of the selected adapter, followed by the actual signing of the 
   * transaction request hash, and if necessary, the `postSign` function of the adapter.
   *
   * @param params - An object that encapsulates all the required parameters for signing.
   * @param params.txParams - Transaction parameters specific to the adapter being used.
   * @param params.type - (Optional) A string indicating the type of the transaction which 
   *                      helps select the appropriate adapter for signing.
   *
   * @returns A promise that returns the transaction signature. Note that the structure 
   *          and format of this signature may differ based on the adapter. 
   * @throws {Error} Will throw an error if the transaction type does not have a corresponding adapter.
   */

  async signTransaction (params: SigTxOps): Promise<unknown> {
    await this.ready
    return this.signingManager.signTransaction(params)
  }


  /**  
 * The `sign` method is tasked with signing a `sigRequestHash`, which is essentially a hash of the 
 * request that needs signing. It does so by obtaining validator information based on the hash, 
 * formatting transaction requests for these validators, and then submitting these requests for the 
 * validators to sign.
 * 
 * The process in detail:
 * 1. The method removes any hex prefix from the request hash.
 * 2. Determines a set of validators corresponding to the stripped request hash. These validators 
 *    are tasked with validating and signing the transaction.
 * 3. For each of these validators, the method constructs a transaction request. This request encompasses:
 *    - The stripped transaction request hash.
 *    - Information regarding all the chosen validators.
 *    - A timestamp.
 * 4. Transaction requests are individually encrypted and signed for each validator using their respective public keys.
 * 5. These encrypted and signed transaction requests are dispatched to the individual validators.
 * 6. The method then awaits the validators' signatures on the requests.
 * 7. Once received, the signature from the first validator is extracted and returned.
 * 
 * @param params An object `sigRequestHash`, representing the hash of the request awaiting signature.
 * @returns A promise which, when resolved, produces a Uint8Array with the signature of the first validator.
 * @throws {Error} Throws an error if there's an error at any stage in the signing routine.
 */


  async sign (params: SigOps): Promise<Uint8Array> {
    await this.ready
    return this.signingManager.sign(params)
  }
}
