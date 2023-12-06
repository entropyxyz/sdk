import ExtrinsicBaseClass from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'

export interface RegistrationParams {
  freeTx?: boolean
  initialProgram?: string
  keyVisibility?: 'Public' | 'Permissioned' | 'Private'
  programModAccount: Address
}

export interface RegisteredInfo {
  keyVisibility: KeyVisibilityInfo
  verifyingKey: string
}

export type KeyVisibilityInfo =
  | { public: null }
  | { permissioned: null }
  | { private: null }

/**
 * The `RegistrationManager` class provides functionality for user registration using the Polkadot/Substrate API.
 * It extends the `ExtrinsicBaseClass` to handle extrinsic submissions and utility methods.
 * 
 * Includes registering a user, checking if a user is already registered, and listening for registration events.
 * 
 */

export default class RegistrationManager extends ExtrinsicBaseClass {
  
  /**
   * Constructs a new instance of the `RegistrationManager` class.
   * 
   * @param substrate - The Polkadot/Substrate API instance.
   * @param signer - The signer used for signing transactions.
   */

  constructor ({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
  }

  /**
   * Registers a user with the given parameters.
   *
   * @param freeTx - Optional. Indicates if the transaction should be free (default: true).
   * @param initialProgram - Optional. Initial program associated with the user.
   * @param keyVisibility - Key visibility level ('Public', 'Permissioned', 'Private'). Defaults to 'Permissioned'.
   * @param programModAccount - Account authorized to modify programs on behalf of the user.
   * 
   * @returns A promise that resolves when the user is successfully registered.
   * @throws {Error} If the user is already registered.
   */

  async register ({
    freeTx = true,
    initialProgram,
    keyVisibility = 'Permissioned',
    programModAccount,
  }: RegistrationParams): Promise<RegisteredInfo> {
    const programModificationAccount = programModAccount

    // this is sloppy
    // TODO: store multiple signers via address. and respond accordingly
    // however it should be handled in extrinsic class and not here

    const isCurrentlyRegistered = await this.checkRegistrationStatus(this.signer.wallet.address)
    if (isCurrentlyRegistered) {
      throw new Error('already registered')
    }

    const registered: Promise<RegisteredInfo> = new Promise((resolve, reject) => {
      try {
        const unsubPromise = this.substrate.rpc.chain.subscribeNewHeads(
          async () => {
            const registeredCheck = await this.checkRegistrationStatus(this.signer.wallet.address)
            if (registeredCheck) {
              const unsub = await unsubPromise
              unsub()
              const registeredData = await this.substrate.query.relayer.registered(this.signer.wallet.address)
              // @ts-ignore: next line
              if (!registeredData.isSome) {
                throw new Error('Registration information not found')
              }
              // @ts-ignore: next line
              const data = registeredData.unwrap()
              resolve({
                keyVisibility: data.keyVisibility.toJSON() as KeyVisibilityInfo, 
                verifyingKey: data.verifyingKey.toString(),
              })
            }
          }
        )
      } catch (e) {
        reject(e)
      }
    })

    const registerTx = this.substrate.tx.relayer.register(
      programModificationAccount,
      keyVisibility,
      initialProgram ? initialProgram : null
    )
    await this.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })

    return registered
  }

  /**
   * Verifies the registration status of an address.
   * 
   * @param address - The address for which registration status needs to be checked.
   * @returns A promise which resolves to `true` if the address is registered, otherwise `false`.
   */

  async checkRegistrationStatus (address: Address): Promise<boolean> {
    const isRegistered = await this.substrate.query.relayer.registered(address)
    return !!isRegistered.toJSON()
  }

}