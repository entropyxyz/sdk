import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { Signer, EventFilter } from '../types'
import { EventRecord } from '@polkadot/types/interfaces/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { RegistryError } from '@polkadot/types-codec/types'

interface Decoded extends RegistryError {
  name: string
  docs: string[]
  section: string
}

/**
 * A utility class to simplify extrinsic operations with the Polkadot/Substrate API.
 * Allows the user to send extrinsics and automatically handles errors, events, and certain special conditions like free transactions.
 * 
*/

export default class ExtrinsicBaseClass {
  substrate: ApiPromise
  signer: Signer

  /**
   * Initializes a new instance of the `ExtrinsicBaseClass`.
   * 
   * @param substrate - The instance of the Polkadot/Substrate API.
   * @param signer - The signer object containing the wallet and other signing-related functionalities.
   */

  constructor ({ substrate, signer }) {
    this.substrate = substrate
    this.signer = signer
  }

  /**
   * Sends an extrinsic and waits for a specific event or rejects with an error.
   *
   * @param call - The extrinsic call to send.
   * @param freeTx - Optional. Flag indicating if the transaction should be free (default: true).
   * @param filter - An event filter to wait for.
   * @returns A promise that resolves with the filtered event record.
   * @throws {Error} Will reject the promise if a dispatch error occurs or the filtered event is not found.
   */

  async sendAndWaitFor (
    call: SubmittableExtrinsic<'promise'>,
    freeTx = false,
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
              const decoded: Decoded = this.substrate.registry.findMetaError(
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
   * Prepares a free transaction, performs a dry run, and ensures its viability.
   *
   * In this system:
   * - **Electricity** represents an energy unit allowing certain transactions to bypass traditional fees.
   * - An account's **Zaps** represent the available electricity it has. Consuming zaps results in transaction execution without fees.
   * - **Batteries** are rechargeable units in an account that generate zaps over time.
   *
   * This method leverages the `callUsingElectricity` from the `freeTx` module to create a transaction that utilizes zaps.
   * A dry run is then performed to ensure its success when broadcasted.
   *
   * @param call - The extrinsic intended for execution.
   * @returns A promise resolving to a transaction prepared to use electricity.
   * @throws {Error} If the dry run fails or there's insufficient electricity (zaps).
   */

  async handleFreeTx (
    call: SubmittableExtrinsic<'promise'>
  ): Promise<SubmittableExtrinsic<'promise'>> {
    const freeTxWrapper = this.substrate.tx.freeTx.callUsingElectricity(call)
    const result = await freeTxWrapper.dryRun(this.signer.wallet)
    if (result.isErr) {
      throw new Error(result.toString())
    }
    return freeTxWrapper
  }
}
