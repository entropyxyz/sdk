import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyJson } from '@polkadot/types-codec/types'
import { Keyring } from '@polkadot/keyring'
import { sr25519PairFromSeed } from '@polkadot/util-crypto'
import { Signer, StashKeys, ThresholdInfo, EventFilter, Address } from './types'
import { SubmittableResult, ApiPromise, WsProvider } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types'

/**
 *
 * A class for interfacing with Entropy's blockchain, read only functions
 * does not require a private key to use
 */
class SubstrateRead {
  /**
   *
   *
   * @type {ApiPromise} the api object for an Entropy chain
   * @memberof SubstrateRead
   */
  api: ApiPromise

  /**
   * Creates an instance of SubstrateRead.
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class does not require a user wallet
   * @param {ApiPromise} api - The {@link ApiPromise} object for an Entropy blockchain
   */
  constructor(api: ApiPromise) {
    this.api = api
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   *
   * @static
   * @param {string} [endpoint='ws://127.0.0.1:9944'] web socket address will default to localhost:9944
   * @returns {*}  {Promise<SubstrateRead>} a {@link SubstrateRead} object
   */
  static async setup(endpoint?: string): Promise<SubstrateRead> {
    const api = await getApi(endpoint)
    return new SubstrateRead(api)
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   *
   * @param {StashKeys} stashKeys - An array of stash keys to query
   * @returns {*}  {Promise<ThresholdInfo>} threshold server keys associated with the server
   */
  async getThresholdInfo(stashKeys: StashKeys): Promise<ThresholdInfo> {
    const result: ThresholdInfo = []
    for (let i = 0; i < stashKeys.length; i++) {
      const r = await this.api.query.stakingExtension.thresholdServers(
        stashKeys[i]
      )
      const convertedResult: any = r.toHuman() ? r.toHuman() : null
      convertedResult ? result.push(convertedResult) : null
    }
    return result
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Gets all stash keys split up into signing subgroups from chain
   *
   * @returns {*}  {Promise<any>} A promise of non converted stash keys
   * @memberof SubstrateRead
   */
  async getStashKeys(): Promise<any> {
    const stashKeys = await this.api.query.stakingExtension.signingGroups.entries()
    return stashKeys
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Gets one key from every signing subgroup
   *
   * @param {*} stashKeys - An array of stash keys to query
   * @returns {*}  {StashKeys} An array of stash keys
   */
  selectStashKeys(stashKeys: any): StashKeys {
    const returnedKeys = []
    stashKeys.map((keyInfo) => {
      // TODO: currently picks first stash key in group (second array item is set to 0)
      // create good algorithm for randomly choosing a threshold server
      returnedKeys.push(keyInfo[1].toHuman()[0])
    })
    return returnedKeys
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Checks if an account is registered
   *
   * @param {Address} address - The address that is being checked if registered
   * @returns {*}  {Promise<AnyJson>} An object that contains the account if it was registered
   */
  async isRegistering(address: Address): Promise<AnyJson> {
    const result = await this.api.query.relayer.registering(address)
    return result.toHuman()
  }
}

/**
 * @alpha
 * @remarks
 * This is the {@link Substrate} class
 * A class for interfacing with the Entropy blockchain, includes read and write functions
 */
export class Substrate extends SubstrateRead {
  signer: Signer

  /**
   * @alpha
   * @remarks
   * This function is part of the {@link Substrate} class
   * Creates an instance of Substrate.
   *
   * @param {ApiPromise} api - The api object for an Entropy blockchain
   * @param {Signer} signer - The signer object for the user interfacing with the Entropy blockchain
   */
  constructor(api: ApiPromise, signer: Signer) {
    super(api)
    this.api = api
    this.signer = signer
  }

  /**
   * @alpha
   * @remarks
   * This function is part of the {@link Substrate} class
   * Static function to setup a Substrate instance
   *
   * @static
   * @param {string} seed - Private key for wallet
   * @param {string} [endpoint] - endpoint websocket address, optional will default to localhost:9944
   * @returns {*}  {Promise<Substrate>} - A promise that resolves to a Substrate object
   */
  static async setup(seed: string, endpoint?: string): Promise<Substrate> {
    const api = await getApi(endpoint)
    const wallet = await getWallet(seed)
    return new Substrate(api, wallet)
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link Substrate} class
   *
   * @param {SubmittableExtrinsic<'promise'>} call - The extrinsic to send.
   * @returns {*}  {Promise<SubmittableExtrinsic<'promise'>>} - A promise that resolves when the transaction is included in a block.
   */
  async handleFreeTx(
    call: SubmittableExtrinsic<'promise'>
  ): Promise<SubmittableExtrinsic<'promise'>> {
    const free_tx_wrapper = this.api.tx.freeTx.callUsingElectricity(call)
    const result = await free_tx_wrapper.dryRun(this.signer.wallet)
    if (result.isErr) {
      throw new Error(result.toString())
    }
    return free_tx_wrapper
  }

  /**
   * @alpha
   *
   * Signs and sends the given `call` from `sender` and waits for the transaction to be included in a block.
   *
   * @param {SubmittableExtrinsic<'promise'>} call - The extrinsic to send.
   * @param {boolean} freeTx - use the free tx pallet
   * @returns {*}  {Promise<undefined>} - A promise that resolves when the transaction is included in a block.
   *
   * @memberof Substrate
   */
  async sendAndWait(
    call: SubmittableExtrinsic<'promise'>,
    freeTx: boolean
  ): Promise<undefined> {
    const newCall = freeTx ? await this.handleFreeTx(call) : call
    return new Promise<undefined>((resolve, reject) => {
      newCall
        .signAndSend(this.signer.wallet, (res: SubmittableResult) => {
          const { dispatchError, status } = res

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = this.api.registry.findMetaError(
                dispatchError.asModule
              )
              const { documentation, name, section } = decoded

              const err = Error(
                `${section}.${name}: ${documentation.join(' ')}`
              )

              err.name = name
              reject(err)
            } else {
              reject(Error(dispatchError.toString()))
            }
          }

          if (status.isInBlock || status.isFinalized) {
            resolve(undefined)
          }
        })
        .catch((e) => {
          reject(Error(e.message))
        })
    })
  }

  /**
   * @alpha
   *
   * @remarks
   * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
   *
   * @param {SubmittableExtrinsic<'promise'>} call - a call submitted to the blockchain
   * @param {boolean} freeTx - transaction to use the free tx pallet
   * @param {EventFilter} filter - which event to filter for
   * @returns {*}  {Promise<EventRecord>} - event that fits the filter
   *
   * @memberof Substrate
   */
  async sendAndWaitFor(
    call: SubmittableExtrinsic<'promise'>,
    freeTx: boolean,
    filter: EventFilter
  ): Promise<EventRecord> {
    const newCall = freeTx ? await this.handleFreeTx(call) : call
    return new Promise<any>((resolve, reject) => {
      newCall
        .signAndSend(this.signer.wallet, (res: SubmittableResult) => {
          const { dispatchError, status } = res

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = this.api.registry.findMetaError(
                dispatchError.asModule
              )
              const { documentation, name, section } = decoded

              reject(Error(`${section}.${name}: ${documentation.join(' ')}`))
            } else {
              reject(Error(dispatchError.toString()))
            }
          }

          if (status.isInBlock || status.isFinalized) {
            const record = res.findRecord(filter.section, filter.name)

            if (record) {
              resolve(record)
            } else {
              reject(Error('Event record not found'))
            }
          }
        })
        .catch((e) => {
          reject(Error(e.message))
        })
    })
  }

  /**
   * @alpha
   *
   * @remarks
   * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
   * This function is part of the {@link Substrate} class.
   *
   * @param {string} constraintModificationAccount The account that will be able to modify the constraints
   * @param {boolean} freeTx transaction meant to use the free tx pallet
   * @param {object} [initialConstraints=null] The initial constraints for the account
   * @returns {*}  {Promise<AnyJson>} Promise if the account is registered
   *
   */
  async register(
    constraintModificationAccount: string,
    freeTx: boolean,
    initialConstraints: object = null
  ): Promise<AnyJson> {
    // Null is the initial constraint
    const tx = this.api.tx.relayer.register(
      constraintModificationAccount,
      initialConstraints
    )
    await this.sendAndWait(tx, freeTx)
    const isRegistered = await this.isRegistering(this.signer.wallet.address)
    return isRegistered
  }
}

/**
 * @alpha
 *
 * @remarks
 * This function is part of the {@link Substrate} class
 *
 * @param {string} [endpoint='ws://127.0.0.1:9944'] websocket address of the chain
 * @returns {*}  {Promise<ApiPromise>} Promise for interfacing with entropy chain
 */
const getApi = async (
  endpoint = 'ws://127.0.0.1:9944'
): Promise<ApiPromise> => {
  const wsProvider = new WsProvider(endpoint)
  const api = new ApiPromise({ provider: wsProvider })
  await api.isReady
  return api
}

/**
 * @alpha
 *
 * @remarks
 * This function is part of the {@link Substrate} class
 *
 * @param {string} seed - the private key of the wallet
 * @returns {*}  {@link Signer} - a signer object for the user talking to the Entropy blockchain
 */
const getWallet = (seed: string): Signer => {
  const keyring = new Keyring({ type: 'sr25519' })
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)
  return { wallet, pair }
}
