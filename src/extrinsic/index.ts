import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { RegistryError } from '@polkadot/types-codec/types'

import { Signer } from '../keys/types/internal'
import { EventFilter } from '../types/internal'

interface Decoded extends RegistryError {
  name: string
  docs: string[]
  section: string
}
/**
 * A utility class to simplify extrinsic operations with Entropy
 * Allows the user to send extrinsics and automatically handles errors, and events
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
    console.log('signer in extrinsic base class:', this.signer.pair)
  }
  /**
   * Sends an extrinsic and waits for a specific event or rejects with an error.
   *
   * @param call - The extrinsic call to send.
   * @param filter - An event filter to wait for.
   * @returns A promise that resolves with the filtered event record.
   * @throws {Error} Will reject the promise if a dispatch error occurs or the filtered event is not found.
   */
  async sendAndWaitFor (
    call: SubmittableExtrinsic<'promise'>,
    filter: EventFilter
  ): Promise<EventRecord> {
    const pair = this.signer.pair
    this.signer.used = true
    return new Promise<EventRecord>((resolve, reject) => {
      call
        .signAndSend(pair, (res: SubmittableResult) => {
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
            const record: EventRecord = res.findRecord(
              filter.section,
              filter.name
            )
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
}
