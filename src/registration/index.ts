import ExtrinsicBaseClass from '../extrinsic'
import { HexString, SS58Address } from '../keys/types/json'
import { ApiPromise } from '@polkadot/api'
import { ProgramInstance } from '../programs'
import { Signer } from '../keys/types/internal'
import { Address } from '../types/internal'

export interface RegistrationParams {
  programDeployer?: SS58Address
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

export type KeyVisibilityInfo = { public: null }

/**
 * the sdk currently only supports 'public' account types from core
 * */

const keyVisibility = 'Public'
/**
 * The `RegistrationManager` class provides functionality for user registration using Entropy
 * It extends the `ExtrinsicBaseClass` to handle extrinsic submissions and utility methods.
 *
 * A class to manage the registration of accounts, including handling key visibility and program data.
 */

export default class RegistrationManager extends ExtrinsicBaseClass {
  
  /**
   * Constructs a new instance of the `RegistrationManager` class.
   *
   * @param {ApiPromise} substrate - The Polkadot/Substrate API instance.
   * @param {Signer} signer - The Signer instance.
   * @param verifyingKey - The key verification key that corresponds to a signer.

   */

  verifyingKey: string

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
   * @param programPointer - Optional. Initial program associated with the user.
   * @param keyVisibility - Key visibility level ('Public', 'Private'). Defaults to 'Public'.
   * @param programDeployer - Account authorized to modify programs on behalf of the user.
   *
   * @returns {Promise<AccountRegisteredSuccess>} A promise that resolves to the registration success information.
   * @throws {Error} If registration information is not found or any other error occurs during registration.
   */

  async register ({
    programDeployer,
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

    const registered: Promise<AccountRegisteredSuccess> = new Promise(
      (resolve, reject) => {
        try {
          console.log("in registration manager", this.verifyingKey)
          if (!this.verifyingKey) {
            console.log("No verifying key available.")
            return registered
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

    // Convert the program data to the appropriate format and create a registration transaction.
    const registerTx = this.substrate.tx.registry.register(
      programDeployer,
      keyVisibility,
      programData.map((programInfo) => { return {programPointer: programInfo.programPointer, programConfig: programInfo.programConfig} })
    )
    
    // Send the registration transaction and wait for the result.
    const registrationTxResult = await this.sendAndWaitFor (registerTx,{
      section: 'registry',
      name: 'AccountRegistered',
    })

    // @ts-ignore: next line
    const { verifyingKey } = registrationTxResult.event.data.toHuman()

    
    return verifyingKey
  }
}
