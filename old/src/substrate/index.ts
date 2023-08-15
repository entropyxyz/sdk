import { SubmittableExtrinsic } from '@polkadot/api/types'
import { AnyJson } from '@polkadot/types-codec/types'
import { Keyring } from '@polkadot/keyring'
import { SubmittableResult } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types'
import { Signer, EventFilter, Address } from './types'
import { SubstrateRead } from './read'
import { getWallet } from './utils'

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
  constructor (api: ApiPromise, signer: Signer) {
    super(api)
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
  static async setup (seed: string, endpoint?: string): Promise<Substrate> {
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
  async handleFreeTx (
    call: SubmittableExtrinsic<'promise'>
  ): Promise<SubmittableExtrinsic<'promise'>> {
    const free_tx_wrapper = this.substrate.tx.freeTx.callUsingElectricity(call)
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
   * @returns {*}  {Promise<EventRecord>} - a promise that contains the event that fits the filter
   *
   * @memberof Substrate
   */
  async sendAndWait (
    call: SubmittableExtrinsic<'promise'>,
    freeTx: boolean
  ): Promise<EventRecord> {
    const newCall = freeTx ? await this.handleFreeTx(call) : call
    return new Promise<EventRecord>((resolve, reject) => {
      newCall
        .signAndSend(this.signer.wallet, (res: SubmittableResult) => {
          const { dispatchError, status } = res

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = this.substrate.registry.findMetaError(
                dispatchError.asModule
              )
              const { docs, name, section } = decoded

              const err = Error(`${section}.${name}: ${docs.join(' ')}`)

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
   * @returns {*}  {Promise<EventRecord>} - a promise that contains the event that fits the filter
   *
   * @memberof Substrate
   */
  async sendAndWaitFor (
    call: SubmittableExtrinsic<'promise'>,
    freeTx: boolean,
    filter: EventFilter
  ): Promise<EventRecord> {
    const newCall = freeTx ? await this.handleFreeTx(call) : call
    return new Promise<EventRecord>((resolve, reject) => {
      newCall
        .signAndSend(this.signer.wallet, (res: SubmittableResult) => {
          const { dispatchError, status } = res

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = this.substrate.registry.findMetaError(
                dispatchError.asModule
              )
              const { docs, name, section } = decoded

              reject(Error(`${section}.${name}: ${docs.join(' ')}`))
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
  async register (
    constraintModificationAccount: string,
    freeTx: boolean,
    initialConstraints: object = null
  ): Promise<AnyJson> {
    // Null is the initial constraint
    const tx = this.substrate.tx.relayer.register(
      constraintModificationAccount,
      initialConstraints
    )
    await this.sendAndWait(tx, freeTx)
    const isRegistered = await this.isRegistering(this.signer.wallet.address)
    return isRegistered
  }
}
