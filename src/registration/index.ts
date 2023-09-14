import { crypto } from '../utils/crypto'
import Extrinsic from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'

export interface RegistrationParams {
  freeTx?: boolean;
  initialProgram?: string;
}

export default class RegistrationManager extends Extrinsic {
  substrate: ApiPromise
  signer: Signer

  constructor ({ substrate, signer,}: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
  }

  async register ({
    freeTx = true,
    initialProgram,
  }: RegistrationParams) {
    // this is sloppy
    // TODO: store multiple signers via address. and respond accordingly
    // however it should be handled in extrinsic class and not here
    const address = this.signer.wallet.address

    const isCurrentlyRegistered = await this.checkRegistrationStatus(address)
    if (isCurrentlyRegistered) {
      throw new Error('already registered')
    }

    // subcribe to new blocks
    //then for every new block query events
    // fgilter through events for accountregistartion :P vom
    // this.substrate.events.relayer.AccountRegistered
    // unsubcribes from blocks once event has been found
    // const registered = new Promise((resolve, reject) => {
    //   try {
    //     const unsub = this.substrate.rpc.chain.subscribeNewHeads(async () => {
    //       const registered = await this.checkRegistrationStatus(this.signer.wallet.address)
    //       if (registered) {
    //         unsub()
    //         resolve()
    //       }
    //     })
    //   } catch (e) {
    //     reject(e)
    //   }
    // })

    const registerTx = this.substrate.tx.relayer.register(
      address,
      initialProgram ? initialProgram : null
    )

    await this.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })

    return registered
  }

  async checkRegistrationStatus (address: Address): Promise<boolean> {
    const isRegistered = await this.substrate.query.relayer.registered(
      address
    )

    return !!isRegistered.unwrapOr(false)
  }
}
