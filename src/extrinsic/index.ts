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

export default class ExtrinsicBaseClass {
  substrate: ApiPromise
  signer: Signer

  constructor ({ substrate, signer }) {
    this.substrate = substrate
    this.signer = signer
  }
  async sendAndWaitFor (
    call: SubmittableExtrinsic<'promise'>,
    freeTx = true,
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
    const freeTxWrapper = this.substrate.tx.freeTx.callUsingElectricity(call)
    const result = await freeTxWrapper.dryRun(this.signer.wallet)
    if (result.isErr) {
      throw new Error(result.toString())
    }
    return freeTxWrapper
  }
}
