import { ApiPromise, WsProvider } from '@polkadot/api'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigTxOps } from './signing'
import { crypto } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import { isValidPair, getWallet } from './keys'
import { Signer, Address } from './types'
import ProgramManager from './programs'

// TODO: docs - way more detail
// TODO: are all of these fields really optional?
// QUESTION: why are some of these strings, some objects?
export interface EntropyAccount {
  /** Signing object used for requests, use getWallet to build */
  sigRequestKey?: Signer
  /** Signing object used for modifiying programs, use getWallet to build */
  programModKey?: Signer | string
  /** Signing object used for deploying programs, use getWallet to build */
  programDeployKey?: Signer
  /** Key used to verify ..... what? */
  verifyingKey?: string
}

export interface EntropyOpts {
  /** Account info for wallet initialization. */
  account: EntropyAccount
  /** The endpoint for connecting to validators, either local or devnet.
   *
   * @defaultValue `ws://127.0.0.1:9944` */
  // TODO: is endpoint really optional? seems kinda necessary
  // QUESTION: where is the default set? ... leave a comment
  // TODO: did you know that in polkadot this is `string | [string]` ?!
  endpoint?: string
  /** A collection of signing adapters for handling various transaction types. */
  adapters?: { [key: string | number]: Adapter }
}

/**
 * @remarks
 * The main interface for users wanting to interact with Entropy.
 * This class provides methods to register, check registration status,
 * and sign transactions. Users can await the `ready` promise to ensure
 * that the class has been initialized before performing operations.
 *
 * @example
 * ```typescript
 * import Entropy, { getWallet } from '@entropyxyz/sdk'
 *
 * const seed = '98fb1f513a1d979aab3e77e4cb447fc7b0d724924314af4fb8f12e0140adc584'
 * const signer = await getWallet(seed);
 *
 * const entropyAccount: EntropyAccount = {
 *   sigRequestKey: signer,
 *   programModKey: signer,
 * };
 *
 * const entropy = new Entropy({ account: entropyAccount });
 * await entropy.ready;
 * ```
 * @alpha
 */

class Entropy {
  /** @internal */
  #ready?: (value?: unknown) => void
  /** @internal */
  #fail?: (reason?: unknown) => void
  /** @internal */
  #programReadOnly: boolean
  /** @internal */
  #allReadOnly: boolean

  /** A promise that resolves once chacha20poly1305 cryptoLib has been loaded */
  ready: Promise<boolean>
  /** An async getter to test if an address is registered */
  isRegistered: (address: Address) => Promise<boolean>

  // QUESTION - should these be hidden properties?
  /** The RegistrationManager instance responsible for ... TODO: */
  registrationManager: RegistrationManager
  /** The ProgramManager instance responsible for ... TODO: */
  programs: ProgramManager
  /** The SignatureRequestManager instance responsible for ... TODO: */
  signingManager: SignatureRequestManager
  /** The account this instance uses for signing ... TODO: */
  account: EntropyAccount
  /** The substrate instance used to ... TODO: */
  substrate: ApiPromise

  /**
   * Initializes an instance of the Entropy class.
   *
   * @param {EntropyOpts} opts - The configuration options for the Entropy instance.
   */

  constructor(opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })

    this.#init(opts).catch((error) => {
      this.#fail(error)
    })
  }

  async #init(opts: EntropyOpts) {
    this.account = opts.account
    this.#setReadOnlyStates()

    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReadyOrError.catch((err) => {
      const cause =
        err.message === 'connect ECONNREFUSED 127.0.0.1:9944'
          ? 'Entropy#init EntropyAccount.endpoint not accessible'
          : 'Entropy#init substrate startup failed'
      throw new Error(err.error, { cause })
      // NOTE this err is from ws, has non-standard API
    })

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: {
        wallet: this.account.sigRequestKey.wallet,
        pair: this.account.sigRequestKey.pair,
      },
    })
    this.signingManager = new SignatureRequestManager({
      signer: {
        wallet: this.account.sigRequestKey.wallet,
        pair: this.account.sigRequestKey.pair,
      },
      substrate: this.substrate,
      adapters: opts.adapters,
      crypto,
    })

    const programModKeyPair = isValidPair(this.account.programModKey as Signer)
      ? this.account.programModKey
      : undefined

    this.programs = new ProgramManager({
      substrate: this.substrate,
      programModKey:
        (programModKeyPair as Signer) || this.account.sigRequestKey,
      programDeployKey: this.account.programDeployKey,
    })
    if (this.#programReadOnly || this.#allReadOnly)
      this.programs.set = async () => {
        throw new Error(
          'Programs is in a read only state: Must pass a valid key pair in initialization.'
        )
      }
    this.#ready(true)
    this.isRegistered = this.registrationManager.checkRegistrationStatus.bind(
      this.registrationManager
    )
    this.#setVerfiyingKeys()
  }

  async #setVerfiyingKeys(): Promise<void> {
    // if an account was provided
    if (this.account) {
      // and their is a sigRequest key
      if (this.account.sigRequestKey) {
        const address = this.account.sigRequestKey.wallet.address
        // check if it is registered
        if (await this.isRegistered(address)) {
          // then get the verifyingKey from the registration record
          // on chain and set it on the account object
          this.account.verifyingKey = await this.getVerifyingKey(address)
        }
      }
    }
  }

  /** @internal */
  #setReadOnlyStates(): void {
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
    } else if (
      !isValidPair({
        wallet: this.account.sigRequestKey.wallet,
        pair: this.account.sigRequestKey.pair,
      })
    ) {
      throw new Error(
        'AccountTypeError: sigRequestKey not a valid signing pair'
      )
    }

    if (typeof this.account.programModKey === 'string') {
      if (!isValidSubstrateAddress(this.account.programModKey)) {
        throw new Error('AccountTypeError: programModKey not a valid address')
      }
      this.#programReadOnly = true
    }
  }

  /**
   * Registers an address with Entropy using the provided parameters.
   *
   * @param {RegistrationParams & { account?: EntropyAccount }} params - The registration parameters.
   * @returns {Promise<void>} A promise indicating the completion of the registration process.
   * @throws {TypeError} - If the provided address format is incompatible.
   * @throws {Error} - If the address is already registered or if there's a problem during registration.
   */

  async register(
    params: RegistrationParams & { account?: EntropyAccount }
  ): Promise<void> {
    await this.ready
    if (this.#allReadOnly)
      throw new Error(
        'Initialized in read only state: can not use write functions'
      )
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
    await this.registrationManager.register(params)
    this.account.verifyingKey = await this.getVerifyingKey(
      this.account.sigRequestKey.wallet.address
    )
  }

  /**
   * Retrieves the verifying key associated with the given address's registration record.
   *
   * @param {Address} address - The address for which the verifying key is needed.
   * @returns {Promise<string>} - A promise resolving to the verifying key.
   */

  async getVerifyingKey(address: Address): Promise<string> {
    const registeredInfo = await this.substrate.query.relayer.registered(
      address
    )
    // @ts-ignore: next line
    return registeredInfo.toHuman().verifyingKey
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
   * @param {SigTxOps} params - The parameters for signing the transaction.
   * @returns {Promise<unknown>} - A promise resolving to the transaction signature.
   * @throws {Error} - If no adapter is found for the specified transaction type.
   * @returns A promise that returns the transaction signature. Note that the structure
   *          and format of this signature may differ based on the adapter.
   * @throws {Error} Will throw an error if the transaction type does not have a corresponding adapter.
   */

  async signTransaction(params: SigTxOps): Promise<unknown> {
    await this.ready
    if (this.#allReadOnly)
      throw new Error(
        'Initialized in read only state: can not use write functions'
      )
    return this.signingManager.signTransaction(params)
  }

  /**
   * Signs a signature request hash. This method involves various steps including validator
   * selection, transaction request formatting, and submission of these requests to validators
   * for signing. It returns the signature from the first validator after validation.
   *
   * @param {SigOps} params - The signature operation parameters.
   * @returns {Promise<Uint8Array>} - A promise resolving to the signed hash as a Uint8Array.
   * @throws {Error} - If there's an error in the signing routine.
   */

  async sign(params: SigOps): Promise<Uint8Array> {
    await this.ready
    if (this.#allReadOnly)
      throw new Error(
        'Initialized in read only state: can not use write functions'
      )
    return this.signingManager.sign(params)
  }
}

export default Entropy
export { getWallet }
