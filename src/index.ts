import { ApiPromise, WsProvider } from '@polkadot/api'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigTxOps } from './signing'
import { crypto } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import { getWallet, isValidPair } from './keys'
import { Signer, Address } from './types'
import ProgramManager from './programs'

export interface EntropyAccount {
  sigRequestKey?: Signer
  programModKey?: Signer | string
}

export interface EntropyOpts {
  /** account for wallet initialization. */
  account?: EntropyAccount
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
 * 
    const signer = await getWallet(charlieStashSeed)

    // OR pass Charlie seed as string 
    // const signer = charlieStashSeed

    const entropyAccount: EntropyAccount = {
      sigRequestKey: signer,
      programModKey: signer
    }

    entropy = new Entropy({ account: entropyAccount})

    await entropy.ready * await entropy.ready
    await entropy.register({ address, keyVisibility: 'Permissioned', freeTx: false })
    
 * ```
 * @alpha
 */

export default class Entropy {
  #ready?: (value?: unknown) => void
  #fail?: (reason?: unknown) => void
  #programReadOnly: boolean
  #allReadOnly: boolean
  /** A promise that resolves once chacha20poly1305 cryptoLib has been loaded */
  ready: Promise<void>
  public sigRequestPublicKey?: string
  public programModPublicKey?: string
  keys?: Signer
  registrationManager: RegistrationManager
  isRegistered: (address: Address) => Promise<boolean>
  programs: ProgramManager
  signingManager: SignatureRequestManager
  account?: EntropyAccount
  substrate: ApiPromise

  constructor (opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })

    this.#init(opts).catch((error) => {
      this.#fail(error)
    })
  }

  async #init (opts: EntropyOpts) {
    this.account = opts.account
    this.#setReadOnlyStates()

    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReady

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: getWallet(this.account.sigRequestKey),
    })
    this.signingManager = new SignatureRequestManager({
      signer: getWallet(this.account.sigRequestKey),
      substrate: this.substrate,
      adapters: opts.adapters,
      crypto,
    })

    const programModKeyPair = isValidPair(this.account.programModKey) ? this.account.programModKey : undefined

    this.programs = new ProgramManager({
      substrate: this.substrate,
      signer: getWallet(programModKeyPair || this.account.sigRequestKey),
    })
    if (this.#programReadOnly || this.#allReadOnly) this.programs.set = async () => { throw new Error('Programs is in a read only state: Must pass a valid key pair in initialization.') }
    this.#ready()
    this.isRegistered = this.registrationManager.checkRegistrationStatus.bind(
      this.registrationManager
    )
  }

  #setReadOnlyStates (): void {
   // the readOnly state will not allow for write functions
    this.#programReadOnly = false
    this.#allReadOnly = false

    if (!this.account) {
      this.#allReadOnly = true
    } else if (!this.account.sigRequestKey && !this.account.programModKey) {
      this.#allReadOnly = true
    }


    if (typeof this.account.sigRequestKey !== 'object') {
      throw new Error('AccountTypeError: sigRequestKey can not be a string')
    } else if (!isValidPair(this.account.sigRequestKey)) {
      throw new Error('AccountTypeError: sigRequestKey not a valid signing pair')
    }

    if (typeof this.account.programModKey === 'string') {
      if (!isValidSubstrateAddress(this.account.programModKey)) {
        throw new Error('AccountTypeError: programModKey not a valid address')
      }
      this.#programReadOnly = true
    }
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

  async register (
    params: RegistrationParams & { account?: EntropyAccount }
  ): Promise<void> {
    await this.ready
    if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
    const account = params.account || this.account

    if (!account) {
      throw new Error('No account provided for registration')
    }

    if (
      params.programModAccount &&
      !isValidSubstrateAddress(params.programModAccount)
    ) {
      throw new TypeError('Incompatible address type')
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
    if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
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
    if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
    return this.signingManager.sign(params)
  }
}
