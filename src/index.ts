import { ApiPromise, WsProvider } from '@polkadot/api'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigMsgOps } from './signing'
import { crypto, } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import ProgramManager from './programs'
import Keyring from './keys'
import { EntropyAccount } from './keys/types/json'

import { ChildKey } from './keys/types/constants'
import { DEVICE_KEY_PROXY_PROGRAM_INTERFACE } from './signing/adapters/device-key-proxy'


export interface EntropyOpts {
  /** keyring class instance object. */
  keyring: Keyring
  /** local or devnet endpoint for establishing a connection to validators */
  endpoint?: string
  /** A collection of signing adapters. */
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
 * const signer = await getWallet(charlieStashSeed)
 *
 * const entropyAccount: EntropyAccount = {
 *   sigRequestKey: signer,
 *   programModKey: signer,
 * }
 *
 * const entropy = new Entropy({ account: entropyAccount })
 * await entropy.ready
 *
 * await entropy.register({
 *   programModAccount: '5Gw3s7q9...',
 * })
 * ```
 * @alpha
 */

export default class Entropy {
  /** @internal */
  #ready?: (value?: unknown) => void
  /** @internal */
  #fail?: (reason?: unknown) => void
  /** A promise that resolves once chacha20poly1305 cryptoLib has been loaded */
  ready: Promise<boolean>
  registrationManager: RegistrationManager
  isRegistered: (verifyingKey: string) => Promise<boolean>
  programs: ProgramManager
  signingManager: SignatureRequestManager
  keyring: Keyring
  substrate: ApiPromise

  /**
   * Initializes an instance of the Entropy class.
   *
   * @param {EntropyOpts} opts - The configuration options for the Entropy instance.
   * @param {EntropyAccount} [opts.account] - Account information for wallet initialization.
   * @param {string} [opts.endpoint] - The endpoint for connecting to validators, either local or devnet.
   * @param {Adapter[]} [opts.adapters] - A collection of signing adapters for handling various transaction types.
   */

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
    this.keyring = opts.keyring

    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReady

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: this.keyring.getLazyLoadKeyProxy(ChildKey.REGISTRATION),
    })
    this.signingManager = new SignatureRequestManager({
      signer: this.keyring.getLazyLoadKeyProxy(ChildKey.DEVICE_KEY),
      substrate: this.substrate,
      adapters: opts.adapters,
      crypto,
    })

    this.programs = new ProgramManager({
      substrate: this.substrate,
      programModKey: this.keyring.getLazyLoadKeyProxy(ChildKey.REGISTRATION),
      deployer: this.keyring.getLazyLoadKeyProxy(ChildKey.PROGRAM_DEV),
    })
    this.#ready(true)
  }

  /**
   * Registers an address with Entropy using the provided parameters.
   *
   * @param {RegistrationParams & { account?: EntropyAccount }} params - The registration parameters.
   * @param {Address} params.programModAccount - The address authorized to set programs on behalf of the user.
   * @param {'Private' | 'Public' } [params.keyVisibility] - Visibility setting for the key.
   * @param {ProgramData[]} [params.programPointer] - Optional initial programs associated with the user.
   * @returns {Promise<void>} A promise indicating the completion of the registration process.
   * @throws {TypeError} - If the provided address format is incompatible.
   * @throws {Error} - If the address is already registered or if there's a problem during registration.
   */

  // FRANKIE im not entirely sure this is the way we want to be doing things
  // async subscribeToAccountRegisteredEvents (callback: (verifyingKey: string) => void) {
  //   await this.substrate.query.system.events((events) => {
  //     events.forEach((record) => {
  //       const { event } = record
  //       if (event.section === 'registry' && event.method === 'AccountRegistered') {
  //         const [accountId, verifyingKeyBytes] = event.data
  //         if (this.account && this.account.sigRequestKey && this.account.sigRequestKey.wallet.address === accountId.toString()) {
  //           const verifyingKey = verifyingKeyBytes.toString()
  //           this.account.verifyingKey = verifyingKey
  //           console.log(`Account ID: ${accountId.toString()}, Verifying Key: ${verifyingKey}`)
  //           callback(verifyingKey)
  //         }
  //       }
  //     })
  //   })
  //   // const yodos = this.substrate.disconnect()
  //   // console.log("yodos", yodos)
  //   // const yotres = this.substrate.isReady
  //   // console.log("yotres", yotres)
  // }


  async register (
    params: RegistrationParams & { account?: EntropyAccount }
  ): Promise<void> {
    await this.ready && this.substrate.isReady
    const defaultProgram = DEVICE_KEY_PROXY_PROGRAM_INTERFACE

    const deviceKey = this.keyring.getLazyLoadKeyProxy(ChildKey.DEVICE_KEY)
    defaultProgram.userConfig.sr25519PublicKeys.push(deviceKey)

    const account = this.keyring

    if (!account) {
      throw new Error('No account provided for registration')
    }

    if (
      params.programDeployer &&
      !isValidSubstrateAddress(params.programDeployer)
    ) {
      throw new TypeError('Incompatible address type')
    }
    
    const verifyingKey = await this.registrationManager.register(params)

    // fuck frankie TODO: Make legit function 
    const vk = this.keyring.accounts[ChildKey.DEVICE_KEY].verifyingKeys
    this.keyring.accounts[ChildKey.DEVICE_KEY].verifyingKeys = [...vk, verifyingKey]


    // this.subscribeToAccountRegisteredEvents((verifyingKey: string) => {
    //   console.log(`Received verifyingKey after registration: ${verifyingKey}`)
    // })
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
   * @param {TxParams} params.txParams - Transaction-specific parameters.
   * @param {string} [params.type] - The type of the transaction for adapter selection.
   * @returns {Promise<unknown>} - A promise resolving to the transaction signature.
   * @throws {Error} - If no adapter is found for the specified transaction type.
   * @returns A promise that returns the transaction signature. Note that the structure
   *          and format of this signature may differ based on the adapter.
   * @throws {Error} Will throw an error if the transaction type does not have a corresponding adapter.
   */

  async signWithAdapter (params: SigMsgOps): Promise<unknown> {
    await this.ready && this.substrate.isReady
    return this.signingManager.signWithAdapter(params)
  }

  /**
   * Signs a signature request hash. This method involves various steps including validator
   * selection, transaction request formatting, and submission of these requests to validators
   * for signing. It returns the signature from the first validator after validation.
   *
   * @param {SigOps} params - The signature operation parameters.
   * @param {string} params.sigRequestHash - The hash of the signature request.
   * @param {string} [params.hash] - The hash type.
   * @param {unknown[]} [params.auxilaryData] - Additional data for the signature operation.
   * @returns {Promise<Uint8Array>} - A promise resolving to the signed hash as a Uint8Array.
   * @throws {Error} - If there's an error in the signing routine.
   */

  async sign(params: SigOps): Promise<Uint8Array> {
    await this.ready
    return this.signingManager.sign(params)
  }
}