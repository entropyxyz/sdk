import ExtrinsicBaseClass from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'

export interface RegistrationParams {
  freeTx?: boolean
  initialProgram?: string
  keyVisibility?: 'Public' | 'Permissioned' | 'Private'
  address: Address
}

export default class RegistrationManager extends ExtrinsicBaseClass {
  constructor ({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
  }

  async register ({
    freeTx = true,
    initialProgram,
    keyVisibility = 'Permissioned',
    address = this.signer.wallet.address,
  }: RegistrationParams): Promise<undefined> {
    // this is sloppy
    // TODO: store multiple signers via address. and respond accordingly
    // however it should be handled in extrinsic class and not here
    console.log('checking registration')
    const isCurrentlyRegistered = await this.checkRegistrationStatus(address)
    if (isCurrentlyRegistered) {
      throw new Error('already registered')
    }

    // subcribe to new blocks
    //then for every new block query events
    // fgilter through events for accountregistartion :P vom
    // this.substrate.events.relayer.AccountRegistered
    // unsubcribes from blocks once event has been found
    console.log('subscribe to new blocks')
    const registered: Promise<undefined> = new Promise((resolve, reject) => {
      try {
        const unsubPromise = this.substrate.rpc.chain.subscribeNewHeads(
          async () => {
            const registeredCheck = await this.checkRegistrationStatus(
              this.signer.wallet.address
            )
            console.log('subscribe to new blocks: is registered?', registeredCheck)

            if (registeredCheck) {
              console.log('subscribe to new blocks: finish is registered')

              const unsub = await unsubPromise
              console.log('subscribe to new blocks: awaited unsub')
              await unsub()
              console.log('subscribe to new blocks: called unsub')

              resolve(undefined)
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })

    const registerTx = this.substrate.tx.relayer.register(
      address,
      keyVisibility,
      initialProgram ? initialProgram : null
    )
    console.log('created register tx about to send')

    await this.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })

    return registered
  }

  async checkRegistrationStatus (address: Address): Promise<boolean> {
    const isRegistered = await this.substrate.query.relayer.registered(address)
    return !!isRegistered.toJSON()
  }
}
