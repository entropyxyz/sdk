import { ApiPromise, WsProvider } from '@polkadot/api'
import { debug, isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigWithAdapptersOps } from './signing'
import { crypto, loadCryptoLib } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import ProgramManager from './programs'
import Keyring from './keys'
import { keysCryptoWaitReady } from './keys/utils'
import { ChildKey } from './keys/types/constants'
import { DEVICE_KEY_PROXY_PROGRAM_INTERFACE } from './signing/adapters/device-key-proxy'
import { HexString } from './keys/types/json'

export async function wasmGlobalsReady () {
  await loadCryptoLib()
  await keysCryptoWaitReady
}
export interface EntropyOpts {
  /** Keyring class instance object. */
  keyring: Keyring
  /** Local or devnet endpoint for establishing a connection to validators */
  endpoint?: string
  /** A collection of signing adapters. */
  adapters?: { [key: string | number]: Adapter }
}

/**
 * The main class to handle all interactions with the Entropy SDK.
 */
export default class Entropy {
  /** @internal */
  #ready?: (value?: unknown) => void
  /** @internal */
  #fail?: (reason?: unknown) => void
  /** A promise that resolves once the cryptographic library has been loaded. */
  ready: Promise<boolean>
  registrationManager: RegistrationManager
  programs: ProgramManager
  signingManager: SignatureRequestManager
  keyring: Keyring
  substrate: ApiPromise

  /**
   * Initializes an instance of the Entropy class.
   *
   * @param {EntropyOpts} opts - The configuration options for the Entropy instance.
   * @param {string} [opts.endpoint] - The endpoint for connecting to validators, either local or devnet.
   * @param {Adapter[]} [opts.adapters] - A collection of signing adapters for handling various transaction types.
   */

  constructor (opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
      debug('READY')
    })
    this.#init(opts).catch((error) => {
      this.#fail(error)
    })
  }

  /**
   * Initializes the Entropy instance by setting up the keyring, substrate API, and managers.
   *
   * @param {EntropyOpts} opts - The options for configuring the Entropy instance.
   * @returns {Promise<void>} A promise that resolves when the initialization is complete.
   * @private
   */

  async #init (opts: EntropyOpts) {
    this.keyring = opts.keyring
    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReadyOrError.catch((err) => this.#fail(err))

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: this.keyring.getLazyLoadAccountProxy(ChildKey.registration),
    })
    this.signingManager = new SignatureRequestManager({
      signer: this.keyring.getLazyLoadAccountProxy(ChildKey.deviceKey),
      substrate: this.substrate,
      adapters: opts.adapters,
      crypto,
    })

    this.programs = new ProgramManager({
      substrate: this.substrate,
      programModKey: this.keyring.getLazyLoadAccountProxy(
        ChildKey.registration
      ),
      deployer: this.keyring.getLazyLoadAccountProxy(ChildKey.programDev),
    })
    this.#ready(true)
  }

  /**
   * Registers a new account with the provided parameters.
   *
   * @param {RegistrationParams} params - The registration parameters.
   * @param {SS58Address} [params.programDeployer] - The account authorized to modify programs on behalf of the user.
   * @param {ProgramInstance[]} [params.programData] - Optional initial programs associated with the user.
   * @returns {Promise<HexString>} A promise that resolves to the verifying key for the new account when the registration is complete.
   * @throws {Error} If the address is already registered or if there's a problem during registration.
   */
  async register (params?: RegistrationParams): Promise<HexString> {
    const defaultProgram = DEVICE_KEY_PROXY_PROGRAM_INTERFACE

    params = params || {
      programData: [defaultProgram],
      programDeployer: this.keyring.accounts.registration.address,
    }

    await Promise.all([this.ready, this.substrate.isReady])

    const deviceKey = this.keyring.getLazyLoadAccountProxy(ChildKey.deviceKey)
    deviceKey.used = true
    defaultProgram.program_config.sr25519_public_keys.push(
      Buffer.from(deviceKey.pair.publicKey).toString('base64')
    )

    if (
      params.programDeployer &&
      !isValidSubstrateAddress(params.programDeployer)
    ) {
      throw new TypeError('Incompatible address type')
    }

    const verifyingKey = await this.registrationManager.register(params)
    // fuck frankie TODO: Make legit function
    const vk = this.keyring.accounts[ChildKey.registration].verifyingKeys || []
    this.keyring.accounts[ChildKey.registration].verifyingKeys = [
      ...vk,
      verifyingKey,
    ]
    this.keyring.accounts[ChildKey.deviceKey].verifyingKeys = [
      ...vk,
      verifyingKey,
    ]
    return verifyingKey
  }

  /*


    DO NOT DELETE THIS CODE BLOCK

    Signs a given transaction based on the provided parameters.

    The `signTransaction` method invokes the appropriate adapter (chain based configuration)
    based on the type specified in the `params`. This modular approach ensures that various
    transaction types can be supported. The method performs a series of operations, starting
    with the `preSign` function of the selected adapter, followed by the actual signing of the
    transaction request hash, and if necessary, the `postSign` function of the adapter.

  /**
   * Signs a given transaction based on the provided parameters using the appropriate adapter.
   *
   * @param {SigWithAdapptersOps} params - The parameters for signing the transaction.
   * @returns {Promise<unknown>} A promise that resolves to the transaction signature.
   * @throws {Error} If no adapter is found for the specified transaction type.
   */

  async signWithAdaptersInOrder (params: SigWithAdapptersOps): Promise<unknown> {
    (await this.ready) && this.substrate.isReady
    return await this.signingManager.signWithAdaptersInOrder(params)
  }

  /**
   * Signs a signature request hash.
   * This method involves various steps including validator selection, transaction request formatting,
   * and submission of these requests to validators for signing.
   * It returns the signature from the first validator after validation.
   *
   * @param {SigOps} params - The signature operation parameters.
   * @returns {Promise<Uint8Array>} A promise that resolves to the signed hash as a Uint8Array.
   * @throws {Error} If there's an error in the signing routine.
   */

  async sign (params: SigOps): Promise<Uint8Array> {
    await this.ready
    return this.signingManager.sign(params)
  }

  async close () {
    return this.substrate.disconnect()
  }
}
