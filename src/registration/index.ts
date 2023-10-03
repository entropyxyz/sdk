import ExtrinsicBaseClass from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'

export interface RegistrationParams {
  freeTx?: boolean;
  initialProgram?: string;
  keyVisibility?: 'Public' | 'Permissioned' | 'Private';
  address: Address;
}

/**
 * @typedef RegistrationParams
 * 
 * @property {boolean} [freeTx=true] - Indicates if the transaction should be free.
 * @property {string} [initialProgram] - Represents the initial program.
 * @property {('Public' | 'Permissioned' | 'Private')} [keyVisibility='Permissioned'] - Indicates the visibility of the key.
 * @property {Address} address - The address of the user.
 */

export default class RegistrationManager extends ExtrinsicBaseClass {
  substrate: ApiPromise
  signer: Signer

  constructor ({ substrate, signer,}: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
  }

  /**
   * Registers a user w. Entropy.
   * 
   * @param {RegistrationParams} params - Registration parameters.
   * @returns {Promise<undefined>}
   * @throws Will throw an error if the user is already registered.
   */

  async register ({
    freeTx = true,
    initialProgram,
    keyVisibility = 'Permissioned',
    address = this.signer.wallet.address,
  }: RegistrationParams): Promise<undefined> {

    /**
   * Checks if a given address is already registered on Entropy.
   * 
   * @async
   * @function checkRegistrationStatus
   * @param {Address} address - The address of the user to check registration status for.
   * @returns {Promise<boolean>}
   */

    const isCurrentlyRegistered = await this.checkRegistrationStatus(address)
    if (isCurrentlyRegistered) {
      throw new Error('already registered')
    }

    // subcribe to new blocks
    //then for every new block query events
    // filter through events for accountregistartion :P vom
    // this.substrate.events.relayer.AccountRegistered
    // unsubcribes from blocks once event has been found

    const registered: Promise<undefined> = new Promise((resolve, reject) => {
      try {
        const unsubPromise = this.substrate.rpc.chain.subscribeNewHeads(async () => {
          const registeredCheck = await this.checkRegistrationStatus(this.signer.wallet.address)
          console.log('new heads check:', registeredCheck)
          if (registeredCheck) {
            const unsub = await unsubPromise
            unsub()
            resolve(undefined)
          }
        })
      } catch (e) {
        reject(e)
      }
    })

    const registerTx = this.substrate.tx.relayer.register(
      address,
      keyVisibility,
      initialProgram ? initialProgram : null
    )
    console.log('im about to submit a tx')
    const registerTxRecord = await this.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })
    console.log('ive submited a tx', registerTxRecord.toHuman())

    return registered
  }

  /**
   * Checks if a given address is already registered on Entropy.
   * 
   * @param {Address} address - The address of the user to check registration status for.
   * @returns {Promise<boolean>}
   */

  async checkRegistrationStatus (address: Address): Promise<boolean> {
    const isRegistered = await this.substrate.query.relayer.registered(
      address
    )
    console.log('isRegistered::', isRegistered.toHuman())
    return !!isRegistered.unwrapOr(false)
  }
}
