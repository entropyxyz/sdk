// import { ApiPromise, WsProvider } from '@polkadot/api'
// import { isValidSubstrateAddress } from './utils'
// import RegistrationManager, { RegistrationParams } from './registration'
// import SignatureRequestManager, { SigOps, SigTxOps } from './signing'
// import { crypto } from './utils/crypto'
// import { Adapter } from './signing/adapters/types'
// import { isValidPair } from './keys'
// import { Signer, Address } from './types'
// import ProgramManager from './programs'

// export interface EntropyAccount {
//   sigRequestKey?: Signer
//   programModKey?: Signer | string
//   programDeployKey?: Signer
//   verifyingKey?: string
// }

// export interface EntropyOpts {
//   /** account for wallet initialization. */
//   account?: EntropyAccount
//   /** local or devnet endpoint for establishing a connection to validators */
//   endpoint?: string
//   /** A collection of signing adapters. */
//   adapters?: { [key: string | number]: Adapter }
// }

// /**
//  * @remarks
//  * The main interface for users wanting to interact with Entropy.
//  * This class provides methods to register, check registration status,
//  * and sign transactions. Users can await the `ready` promise to ensure
//  * that the class has been initialized before performing operations.
//  *
//  * @example
//  * ```typescript
//  * const signer = await getWallet(charlieStashSeed)
//  *
//  * const entropyAccount: EntropyAccount = {
//  *   sigRequestKey: signer,
//  *   programModKey: signer,
//  * }
//  *
//  * const entropy = new Entropy({ account: entropyAccount })
//  * await entropy.ready
//  *
//  * await entropy.register({
//  *   programModAccount: '5Gw3s7q9...',
//  *   keyVisibility: 'Public',
//  *   freeTx: false
//  * })
//  * ```
//  * @alpha
//  */

// export default class Entropy {
//   /** @internal */
//   #ready?: (value?: unknown) => void
//   /** @internal */
//   #fail?: (reason?: unknown) => void
//   /** @internal */
//   #programReadOnly: boolean
//   /** @internal */
//   #allReadOnly: boolean
//   /** A promise that resolves once chacha20poly1305 cryptoLib has been loaded */
//   ready: Promise<boolean>
//   registrationManager: RegistrationManager
//   isRegistered: (address: Address) => Promise<boolean>
//   programs: ProgramManager
//   signingManager: SignatureRequestManager
//   account?: EntropyAccount
//   substrate: ApiPromise

//   /**
//    * Initializes an instance of the Entropy class.
//    *
//    * @param {EntropyOpts} opts - The configuration options for the Entropy instance.
//    * @param {EntropyAccount} [opts.account] - Account information for wallet initialization.
//    * @param {string} [opts.endpoint] - The endpoint for connecting to validators, either local or devnet.
//    * @param {Adapter[]} [opts.adapters] - A collection of signing adapters for handling various transaction types.
//    */

//   constructor (opts: EntropyOpts) {
//     this.ready = new Promise((resolve, reject) => {
//       this.#ready = resolve
//       this.#fail = reject
//     })

//     this.#init(opts).catch((error) => {
//       this.#fail(error)
//     })
//   }

//   async #init (opts: EntropyOpts) {
//     this.account = opts.account
//     this.#setReadOnlyStates()

//     const wsProvider = new WsProvider(opts.endpoint)
//     this.substrate = new ApiPromise({ provider: wsProvider })
//     await this.substrate.isReady

//     this.registrationManager = new RegistrationManager({
//       substrate: this.substrate,
//       signer: {wallet: this.account.sigRequestKey.wallet, pair: this.account.sigRequestKey.pair},
//     })
//     this.signingManager = new SignatureRequestManager({
//       signer: {wallet: this.account.sigRequestKey.wallet, pair: this.account.sigRequestKey.pair},
//       substrate: this.substrate,
//       adapters: opts.adapters,
//       crypto,
//     })

//     const programModKeyPair = isValidPair(this.account.programModKey as Signer) ? this.account.programModKey : undefined

//     this.programs = new ProgramManager({
//       substrate: this.substrate,
//       programModKey: programModKeyPair as Signer || this.account.sigRequestKey,
//       programDeployKey: this.account.programDeployKey
//     })
//     if (this.#programReadOnly || this.#allReadOnly) this.programs.set = async () => { throw new Error('Programs is in a read only state: Must pass a valid key pair in initialization.') }
//     this.#ready(true)
//     this.isRegistered = this.registrationManager.checkRegistrationStatus.bind(
//       this.registrationManager
//     )
//     this.#setVerfiyingKeys()
//   }

//   async #setVerfiyingKeys (): Promise<void> {
//     // if an account was provided
//     if (this.account) {
//       // and their is a sigRequest key
//       if (this.account.sigRequestKey) {
//         const address = this.account.sigRequestKey.wallet.address
//         // check if it is registered
//         if (await this.isRegistered(address)) {
//           // then get the verifyingKey from the registration record
//           // on chain and set it on the account object
//           this.account.verifyingKey = await this.getVerifyingKey(address)
//         }
//       }
//     }
//   }

//   /** @internal */
//   #setReadOnlyStates (): void {
//   // the readOnly state will not allow for write functions
//     this.#programReadOnly = false
//     this.#allReadOnly = false

//     if (!this.account) {
//       this.#allReadOnly = true
//     } else if (!this.account.sigRequestKey && !this.account.programModKey) {
//       this.#allReadOnly = true
//     }

//     if (typeof this.account.sigRequestKey !== 'object') {
//       throw new Error('AccountTypeError: sigRequestKey can not be a string')
//     } else if (!isValidPair({ wallet: this.account.sigRequestKey.wallet, pair: this.account.sigRequestKey.pair})) {
//       throw new Error('AccountTypeError: sigRequestKey not a valid signing pair')
//     }

//     if (typeof this.account.programModKey === 'string') {
//       if (!isValidSubstrateAddress(this.account.programModKey)) {
//         throw new Error('AccountTypeError: programModKey not a valid address')
//       }
//       this.#programReadOnly = true
//     }
//   }

//   /**
//    * Registers an address with Entropy using the provided parameters.
//    *
//    * @param {RegistrationParams & { account?: EntropyAccount }} params - The registration parameters.
//    * @param {Address} params.programModAccount - The address authorized to set programs on behalf of the user.
//    * @param {'Private' | 'Public' } [params.keyVisibility] - Visibility setting for the key.
//    * @param {boolean} [params.freeTx] - Indicates if the registration transaction should be free.
//    * @param {ProgramData[]} [params.initialPrograms] - Optional initial programs associated with the user.
//    * @returns {Promise<void>} A promise indicating the completion of the registration process.
//    * @throws {TypeError} - If the provided address format is incompatible.
//    * @throws {Error} - If the address is already registered or if there's a problem during registration.
//    */

//   async register (
//     params: RegistrationParams & { account?: EntropyAccount }
//   ): Promise<void> {
//     await this.ready
//     if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
//     const account = params.account || this.account

//     if (!account) {
//       throw new Error('No account provided for registration')
//     }

//     if (
//       params.programModAccount &&
//       !isValidSubstrateAddress(params.programModAccount)
//     ) {
//       throw new TypeError('Incompatible address type')
//     }
//     await this.registrationManager.register(params)
//     this.account.verifyingKey = await this.getVerifyingKey(this.account.sigRequestKey.wallet.address)

//   }

//   /**
//    * Retrieves the verifying key associated with the given address's registration record.
//    *
//    * @param {Address} address - The address for which the verifying key is needed.
//    * @returns {Promise<string>} - A promise resolving to the verifying key.
//    */

//   async getVerifyingKey (address: Address): Promise<string> {
//     const registeredInfo = await this.substrate.query.relayer.registered(address)
//     // @ts-ignore: next line
//     return registeredInfo.toHuman().verifyingKey
//   }

//   /**
//    * Signs a given transaction based on the provided parameters.
//    *
//    * The `signTransaction` method invokes the appropriate adapter (chain based configuration)
//    * based on the type specified in the `params`. This modular approach ensures that various
//    * transaction types can be supported. The method performs a series of operations, starting
//    * with the `preSign` function of the selected adapter, followed by the actual signing of the
//    * transaction request hash, and if necessary, the `postSign` function of the adapter.
//    *
//    * @param {SigTxOps} params - The parameters for signing the transaction.
//    * @param {TxParams} params.txParams - Transaction-specific parameters.
//    * @param {string} [params.type] - The type of the transaction for adapter selection.
//    * @returns {Promise<unknown>} - A promise resolving to the transaction signature.
//    * @throws {Error} - If no adapter is found for the specified transaction type.
//    * @returns A promise that returns the transaction signature. Note that the structure
//    *          and format of this signature may differ based on the adapter.
//    * @throws {Error} Will throw an error if the transaction type does not have a corresponding adapter.
//    */

//   async signTransaction (params: SigTxOps): Promise<unknown> {
//     await this.ready
//     if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
//     return this.signingManager.signTransaction(params)
//   }

//   /**
//    * Signs a signature request hash. This method involves various steps including validator
//    * selection, transaction request formatting, and submission of these requests to validators
//    * for signing. It returns the signature from the first validator after validation.
//    *
//    * @param {SigOps} params - The signature operation parameters.
//    * @param {string} params.sigRequestHash - The hash of the signature request.
//    * @param {string} [params.hash] - The hash type.
//    * @param {unknown[]} [params.auxilaryData] - Additional data for the signature operation.
//    * @returns {Promise<Uint8Array>} - A promise resolving to the signed hash as a Uint8Array.
//    * @throws {Error} - If there's an error in the signing routine.
//    */

//   async sign (params: SigOps): Promise<Uint8Array> {
//     await this.ready
//     if (this.#allReadOnly) throw new Error('Initialized in read only state: can not use write functions')
//     return this.signingManager.sign(params)
//   }
// }

import { ApiPromise, WsProvider } from '@polkadot/api'
import { isValidSubstrateAddress } from './utils'
import RegistrationManager, { RegistrationParams } from './registration'
import SignatureRequestManager, { SigOps, SigTxOps } from './signing'
import { crypto } from './utils/crypto'
import { Adapter } from './signing/adapters/types'
import { isValidPair } from './keys'
import { Signer, Address } from './types'
import ProgramManager from './programs'
import {
  runDkgProtocol,
  ValidatorInfo,
} from '@entropyxyz/entropy-protocol-nodejs'
import { Option } from '@polkadot/types'
import * as util from '@polkadot/util'
import { decodeAddress, encodeAddress} from '@polkadot/util-crypto'
import { hexToU8a } from '@polkadot/util'
import { arraysEqual } from './utils'

export interface EntropyAccount {
  sigRequestKey?: Signer
  programModKey?: Signer | string
  programDeployKey?: Signer
  verifyingKey?: string
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
 *   keyVisibility: 'Permissioned',
 *   freeTx: false
 * })
 * ```
 * @alpha
 */

export default class Entropy {
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
  registrationManager: RegistrationManager
  isRegistered: (address: Address) => Promise<boolean>
  programs: ProgramManager
  signingManager: SignatureRequestManager
  account?: EntropyAccount
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
    this.account = opts.account
    this.#setReadOnlyStates()

    const wsProvider = new WsProvider(opts.endpoint)
    this.substrate = new ApiPromise({ provider: wsProvider })
    await this.substrate.isReady

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

  async #setVerfiyingKeys (): Promise<void> {
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
   * @param {Address} params.programModAccount - The address authorized to set programs on behalf of the user.
   * @param {'Private' | 'Public' | 'Permissioned'} [params.keyVisibility] - Visibility setting for the key.
   * @param {boolean} [params.freeTx] - Indicates if the registration transaction should be free.
   * @param {ProgramData[]} [params.initialPrograms] - Optional initial programs associated with the user.
   * @returns {Promise<void>} A promise indicating the completion of the registration process.
   * @throws {TypeError} - If the provided address format is incompatible.
   * @throws {Error} - If the address is already registered or if there's a problem during registration.
   */

  async register (
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

    if (params.keyVisibility === 'Private') {
      await this.participateInDkgForPrivateVisibility(
        this.account.sigRequestKey.wallet.address
      )

      await this.registrationManager.register(params)
      this.account.verifyingKey = await this.getVerifyingKey(
        this.account.sigRequestKey.wallet.address
      )
    }
  }

  async fetchBlockNumber (): Promise<number> {
    try {
      const blockdos = await this.substrate.rpc.chain.getHeader()

      const blockNumber = blockdos.number.toNumber()
      return blockNumber
    } catch (error) {
      console.error('Error fetching the block number:', error)
      throw error
    }
  }

  async participateInDkgForPrivateVisibility (address: string): Promise<void> {
    const blockNumber = await this.fetchBlockNumber()

    const validatorsInfo = await this.getDKGCommittee(blockNumber)

    const validatorMappings = validatorsInfo.map(validator => ({
      publicKey: validator.getX25519PublicKey(), 
      ipAddress: validator.getIpAddress(),
      tssAccount: encodeAddress(validator.getTssAccount(), 42),
    }))



    console.log("Validator Mappings", validatorMappings)


    const selectedValidatorAccountId = await this.selectValidatorFromSubgroup(0, blockNumber)

    console.log("check account id", selectedValidatorAccountId)
    console.log("hex to u8a validator accout",  decodeAddress(selectedValidatorAccountId))


    const selectedValidatorInfo = validatorsInfo.find(validator =>
      arraysEqual(validator.getTssAccount(), decodeAddress(selectedValidatorAccountId))
    )

    console.log(selectedValidatorInfo.getTssAccount())
    console.log(selectedValidatorInfo.getIpAddress())
    console.log(selectedValidatorInfo.getX25519PublicKey())

    if (!selectedValidatorInfo) {
      throw new Error('Selected validator info not found.')
    }


    const huh = await runDkgProtocol(
      [selectedValidatorInfo],
      this.account.sigRequestKey.pair.secretKey
    )


    console.log("huh", huh)
    console.log('DKG Protocol completed for address:', address)
  }

  async getDKGCommittee (blockNumber: number): Promise<ValidatorInfo[]> {
    const validatorsInfo: ValidatorInfo[] = []
    const SIGNING_PARTY_SIZE = 2

    for (let i = 0; i < SIGNING_PARTY_SIZE; i++) {
      try {
        const accountId = await this.selectValidatorFromSubgroup(i, blockNumber)
        console.log('Account ID:', { accountId })
        const serverInfoOption = ((await this.substrate.query.stakingExtension.thresholdServers(
          accountId
        )) as unknown) as Option<any>

        console.log('Server Info Option:', serverInfoOption.toHuman())

        if (serverInfoOption.isNone) {
          console.error('Stash Fetch Error')
          continue
        }

        const serverInfo = serverInfoOption.unwrap()
        try {
          const validatorInfo = new ValidatorInfo(
            new Uint8Array(serverInfo.x25519PublicKey),
            serverInfo.endpoint.toHuman(),
            new Uint8Array(serverInfo.tssAccount)
          )

          validatorsInfo.push(validatorInfo)

          // to check we can get info back from getters 

          console.log('Public Key:', validatorInfo.getX25519PublicKey())
          console.log('IP Address:', validatorInfo.getIpAddress())
          console.log('TSS Account:', validatorInfo.getTssAccount())

        } catch (error) {
          console.error('Error creating ValidatorInfo:', error)
        }
      } catch (error) {
        console.error(`Error fetching validator info for group ${i}:`, error)
      }
    }

    return validatorsInfo
  }
  async selectValidatorFromSubgroup (
    signingGroup: number,
    blockNumber: number
  ): Promise<string> {
    try {
      const subgroupInfo = ((await this.substrate.query.stakingExtension.signingGroups(
        signingGroup
      )) as unknown) as Option<any>
      if (subgroupInfo.isNone || subgroupInfo.unwrap().isEmpty) {
        throw new Error('Subgroup information not available or empty.')
      }
      const subgroupAddresses = subgroupInfo.unwrap().toArray()

      while (subgroupAddresses.length > 0) {
        const selectionIndex = blockNumber % subgroupAddresses.length
        const address = subgroupAddresses[selectionIndex]

        try {
          const isSynced = await this.substrate.query.stakingExtension.isValidatorSynced(
            address
          )

          if (isSynced) {
            console.log(`Address ${address.toString()} is synced.`)
            return address.toString()
          } else {
            subgroupAddresses.splice(selectionIndex, 1)
            blockNumber++
            console.log(
              `Address ${address.toString()} is not synced. Trying next validator.`
            )
          }
        } catch (error) {
          console.error(
            `Error checking sync status for address ${address.toString()}:`,
            error
          )
          subgroupAddresses.splice(selectionIndex, 1)
        }
      }
      throw new Error('No synced validators found in the subgroup.')
    } catch (error) {
      console.error('Failed to select a validator:', error)
      throw error
    }
  }
  /**
   * Retrieves the verifying key associated with the given address's registration record.
   *
   * @param {Address} address - The address for which the verifying key is needed.
   * @returns {Promise<string>} - A promise resolving to the verifying key.
   */

  async getVerifyingKey (address: Address): Promise<string> {
    const registeredInfo = await this.substrate.query.relayer.registered(
      address
    )
    // @ts-ignore: next line
    return registeredInfo.toHuman().verifyingKey
  }

  async getKeyVisibility (address: Address): Promise<string> {
    const registeredInfo = await this.substrate.query.relayer.registered(
      address
    )

    // @ts-ignore: next line
    return registeredInfo.toHuman().keyVisibility
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

  async signTransaction (params: SigTxOps): Promise<unknown> {
    await this.ready
    if (this.#allReadOnly)
      throw new Error(
        'Initialized in read only state: can not use write functions'
      )

    const keyVisibilityInfo = await this.getKeyVisibility(
      this.account.sigRequestKey.wallet.address
    )

    if (keyVisibilityInfo === 'Private') {
      return this.signingManager.privateSign(params)
    } else {
      return this.signingManager.signTransaction(params)
    }
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

  async sign (params: SigOps): Promise<Uint8Array> {
    await this.ready
    if (this.#allReadOnly)
      throw new Error(
        'Initialized in read only state: can not use write functions'
      )

    return this.signingManager.sign(params)
  }
}
