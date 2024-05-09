import ExtrinsicBaseClass from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'
import { ProgramInstance } from '../programs'
import { EntropyAccount } from '../keys/types'
import { DEFAULT_PROGRAM_INTERFACE } from '../../tests/testing-utils'

export interface RegistrationParams {
  programDeployer?: Address
  keyVisibility?: 'Public'
  programData: ProgramInstance[]
}


export interface RegisteredInfo {
  keyVisibility: KeyVisibilityInfo
  programsData: Uint8Array
  programDeployer: Address
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
  defaultAddress: string
  defaultProgram: typeof DEFAULT_PROGRAM_INTERFACE


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
    programDeployer = this.signer,
    keyVisibility = 'Public',
    programData
  }: RegistrationParams): Promise<RegisteredInfo> {

    // this is sloppy
    // TODO: store multiple signers via address. and respond accordingly
    // however it should be handled in extrinsic class and not here


    /**
   * Verifies the registration status of an address.
   *
   * @param {Address} address - The address for which registration status needs to be checked.
   * @returns {Promise<boolean>} A promise which resolves to `true` if the address is registered, otherwise `false`.
   * @remarks
   * This method queries Entropy to determine if a given address is registered.
   */

    // const isCurrentlyRegistered = await this.checkRegistrationStatus(
    //   this.verifyingKey
    // )
    // if (isCurrentlyRegistered) {
    //   throw new Error('already registered')
    // }

    const registered: Promise<RegisteredInfo> = new Promise(
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
                  this.signer.address
                )
                // @ts-ignore: next line
                if (!registeredData.isSome) {
                  throw new Error('Registration information not found')
                }
                // @ts-ignore: next line
                const data = registeredData.unwrap()
                resolve({
                  keyVisibility: data.keyVisibility.toJSON() as KeyVisibilityInfo,
                  programsData: data.programsData.toJSON(),
                  programDeployer: data.programDeployer.toJSON(),
                  versionNumber: data.versionNumber                  })
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

    await this.sendAndWaitFor (registerTx,{
      section: 'registry',
      name: 'AccountRegistered',
    })
    return registered
  }

  /**
   * Verifies the registration status of an address.
   *
   * @param address - The address for which registration status needs to be checked.
   * @returns A promise which resolves to `true` if the address is registered, otherwise `false`.
   */

//   async checkRegistrationStatus (verifyingKey: Address): Promise<boolean> {
//     if (!verifyingKey) {
//       console.log("no verifying key set")
//       return
//     }
//     const isRegistered = await this.substrate.query.registry.registered(verifyingKey)
//     return !!isRegistered.toJSON()
//   }
}
