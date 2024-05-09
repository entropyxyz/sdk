import { ApiPromise, SubmittableResult } from '@polkadot/api'
import { Signer, EventFilter } from '../types'
import { EventRecord } from '@polkadot/types/interfaces/types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { RegistryError } from '@polkadot/types-codec/types'
import { PolkadotSigner } from '../keys/types/internal'

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
  signer: PolkadotSigner

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
   * @param filter - An event filter to wait for.
   * @returns A promise that resolves with the filtered event record.
   * @throws {Error} Will reject the promise if a dispatch error occurs or the filtered event is not found.
   */

  async sendAndWaitFor (
    call: SubmittableExtrinsic<'promise'>,
    filter: EventFilter
  ): Promise<EventRecord> {
    return new Promise<EventRecord>((resolve, reject) => {
      call
        .signAndSend(this.signer.pair, (res: SubmittableResult) => {
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
            const record: EventRecord = res.findRecord(filter.section, filter.name)
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
