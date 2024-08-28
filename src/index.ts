import { ApiPromise, WsProvider } from '@polkadot/api'
import xtend from 'xtend'
import { isValidSubstrateAddress as isDeployer } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigWithAdaptersOps } from './signing'
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
  /** Keyring used to manage all the keys Entropy uses */
  keyring: Keyring
  /** A websocket endpoint for establishing a connection to validators */
  endpoint?: string
  /** A collection of adapters used for signing messages of particular types.
   *  These help with formatting, configuring hash functions to use, etc.
   * */
  adapters?: { [key: string | number]: Adapter }
}

/**
 * The main class to handle all interactions within the Entropy SDK.
 */
export default class Entropy {
  /** A promise that resolves once all internal setup has been successfully completed. */
  ready: Promise<boolean>

  /* Accessor for ... TODO: */
  registrationManager: RegistrationManager

  /* Accessor for ... TODO: */
  programs: ProgramManager

  /* Accessor for the SignatureRequestManager.
   * Generally you will use entropy.sign or entropy.signWithAdapter
   *
   */
  signingManager: SignatureRequestManager

  /** Accessor for the keyring passed at instantiation */
  keyring: Keyring

  /** (Advanced) Accessor for the raw subtate API. */
  substrate: ApiPromise

  /**
   * @param {EntropyOpts} opts
   *
   * @example
   * ```ts
   * import { Entropy, wasmGlobalsReady } from '@entropyxyz/sdk'
   * import { Keyring } from '@entropyxyz/sdk/keys'
   *
   * async function main () {
   *   const keyring = new Keyring({ seed })
   *   const entropy = new Entropy({ keyring })
   *
   *   await wasmGlobalsReady()
   *   await entropy.ready
   * }
   *
   * main()
   * ```
   */

  constructor (opts: EntropyOpts) {
    if (!opts) throw new Error('missing opts object')

    let ready, fail
    this.ready = new Promise((resolve, reject) => {
      ready = resolve
      fail = reject
    })

    this.#init(opts)
      .then(() => ready(true))
      .catch((error) => fail(error))
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
    this.substrate = new ApiPromise({ provider: wsProvider, noInitWarn: true })
    await this.substrate.isReadyOrError // throws an error if fails

    this.registrationManager = new RegistrationManager({
      substrate: this.substrate,
      signer: this.keyring.getLazyLoadAccountProxy(ChildKey.registration),
    })
    this.signingManager = new SignatureRequestManager({
      keyring: this.keyring,
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
    params = params || this.#getRegisterParamsDefault()
    if (params.programDeployer && !isDeployer(params.programDeployer)) {
      throw new TypeError('Incompatible address type')
    }

    await this.ready
    const verifyingKey = await this.registrationManager.register(params)

    // TODO: Make legit function
    const admin = this.keyring.getLazyLoadAccountProxy(ChildKey.registration)
    const deviceKey = this.keyring.getLazyLoadAccountProxy(ChildKey.deviceKey)
    const vk = admin.verifyingKeys || []

    // HACK: these assignments trigger important `account-update` flows via the Proxy 
    admin.verifyingKeys = [...vk, verifyingKey]
    deviceKey.verifyingKeys = [verifyingKey, ...vk]

    return verifyingKey
  }

  #getRegisterParamsDefault (): RegistrationParams {
    const deviceKey = this.keyring.getLazyLoadAccountProxy(ChildKey.deviceKey)
    deviceKey.used = true

    const defaultProgram = xtend(DEVICE_KEY_PROXY_PROGRAM_INTERFACE, {
      program_config: {
        sr25519_public_keys: [
          Buffer.from(deviceKey.pair.publicKey).toString('base64')
        ]
      }
    })

    return {
      programData: [defaultProgram],
      programDeployer: this.keyring.accounts.registration.address,
    }
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
   * @param {SigWithAdaptersOps} params - The parameters for signing the transaction.
   * @returns {Promise<unknown>} A promise that resolves to the transaction signature.
   * @throws {Error} If no adapter is found for the specified transaction type.
   */

  async signWithAdaptersInOrder (params: SigWithAdaptersOps): Promise<unknown> {
    await this.ready
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

  /**
   * Shuts the Entropy SDK down gracefully.
   * Closes substrate connections for you.
   */
  async close () {
    if (!this.substrate) return

    // NOTE: still need to call disconnect even if !isConnected (T_T)
    await this.substrate.disconnect()
      .catch(err => console.error('Error closing connection', err.message))
  }
}

export {
  Entropy
}
