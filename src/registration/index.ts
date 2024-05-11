import ExtrinsicBaseClass from '../extrinsic'
import { HexString, SS58Address } from '../keys/types/json'
import { ApiPromise } from '@polkadot/api'
import { ProgramInstance } from '../programs'
import { Signer } from '../keys/types/internal'
import { Address } from '../types/internal'

export interface RegistrationParams {
  programDeployer?: SS58Address
  keyVisibility?: 'Public'
  programData: ProgramInstance[]
}

export interface AccountRegisteredSuccess {
  accountId: Address
  verifyingKey: HexString
}

export interface RegisteredInfo {
  keyVisibility: KeyVisibilityInfo
  programsData: Uint8Array
  programDeployer: SS58Address
  versionNumber: number
}

export type KeyVisibilityInfo =
  | { public: null }
  | { private: null }

/**
 * The `RegistrationManager` class provides functionality for user registration using the Polkadot/Substrate API.
 * It extends the `ExtrinsicBaseClass` to handle extrinsic submissions and utility methods.
 *
 * This class includes methods for registering a user, checking if a user is already registered, and listening for registration events.
 */



export default class RegistrationManager extends ExtrinsicBaseClass {
  /**
   * Constructs a new instance of the `RegistrationManager` class.
   *
   * @param {ApiPromise} substrate - The Polkadot/Substrate API instance.
   * @param {Signer} signer - The signer used for signing transactions.
   * @param verifyingKey - The key verification key that corresponds to a signer.

   */

  verifyingKey: string
  signer: Signer


  constructor ({

    substrate,
    signer
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
  }

  /**
   * Registers a user with the given parameters.
   *
   * @param programPointer - Optional. Initial program associated with the user.
   * @param keyVisibility - Key visibility level ('Public', 'Private'). Defaults to 'Public'.
   * @param programDeployer - Account authorized to modify programs on behalf of the user.
   *
   * @returns A promise that resolves when the user is successfully registered.
   * @throws {Error} If the user is already registered.
   */
  // TO-DO: return the verfiying key have it documented that the user needs to save this otherwise that cant request sigs

  async register ({
    programDeployer,
    keyVisibility = 'Public',
    programData
  }: RegistrationParams): Promise<AccountRegisteredSuccess> {

    // this is sloppy
    // TODO: store multiple signers via SS58Address. and respond accordingly
    // however it should be handled in extrinsic class and not here

    /**
     * Verifies the registration status of an SS58Address.
     *
     * @param {SS58Address} SS58Address - The SS58Address for which registration status needs to be checked.
     * @returns {Promise<boolean>} A promise which resolves to `true` if the SS58Address is registered, otherwise `false`.
     * @remarks
     * This method queries Entropy to determine if a given SS58Address is registered.
     */

    // const isCurrentlyRegistered = await this.checkRegistrationStatus(
    //   this.verifyingKey
    // )
    // if (isCurrentlyRegistered) {
    //   throw new Error('already registered')
    // }

    const registered: Promise<AccountRegisteredSuccess> = new Promise(
      (resolve, reject) => {
        try {
          console.log("in registration manager", this.verifyingKey)
          if (!this.verifyingKey) {
            console.log("No verifying key available.")
            return
          }

          const unsubPromise = this.substrate.rpc.chain.subscribeNewHeads(
            async () => {
              const registeredCheck = await this.substrate.query.registry.registered(
                this.verifyingKey
              )
              if (registeredCheck) {
                const unsub = await unsubPromise
                unsub()
                const registeredData = await this.substrate.query.registry.registered(
                  this.verifyingKey
                )
                // @ts-ignore: next line
                if (!registeredData.isSome) {
                  throw new Error('Registration information not found')
                }
              }
            }
          )
        } catch (e) {
          reject(e)
        }
      }
    )

    // Convert the ProgramData to PalletRegistryProgramInstance and wrap it in an array
    const registerTx = this.substrate.tx.registry.register(
      programDeployer,
      keyVisibility,
      programData.map((programInfo) => { return {programPointer: programInfo.programPointer, programConfig: programInfo.programConfig} })
    )

    const registrationTxResult = await this.sendAndWaitFor (registerTx,{
      section: 'registry',
      name: 'AccountRegistered',
    })

    // @ts-ignore: next line
    const { verifyingKey } = registrationTxResult.event.data.toHuman()

    
    return verifyingKey
  }
}
