import { ApiPromise } from '@polkadot/api'
import ExtrinsicBaseClass from '../extrinsic'
import { HexString, SS58Address } from '../keys/types/json'
import { ProgramInstance } from '../programs'
import { Signer } from '../keys/types/internal'
import { Address } from '../types/internal'

export interface RegistrationParams {
  programData: ProgramInstance[]
  /** just testing this functionality, not intending to use this as the set program */
  programDeployer?: SS58Address
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
   * @param program_pointer - Optional. Initial program associated with the user.
   * @param keyVisibility - Key visibility level ('Public', 'Private'). Defaults to 'Public'.
   * @param programDeployer - Account authorized to modify programs on behalf of the user.
   *
   * @returns {Promise<AccountRegisteredSuccess>} A promise that resolves to the registration success information.
   * @throws {Error} If registration information is not found or any other error occurs during registration.
   */

  async register ({
    programDeployer,
    programData,
  }: RegistrationParams): Promise<HexString> {
    // this is sloppy
    // TODO: store multiple signers via SS58Address. and respond accordingly
    // however it should be handled in extrinsic class and not here

    // Convert the program data to the appropriate format and create a registration transaction.
    const registerTx = this.substrate.tx.registry.register(
      programDeployer,
      keyVisibility,
      programData.map((programInfo) => {
        return {
          program_pointer: programInfo.program_pointer,
          program_config: Array.from(
            Buffer.from(JSON.stringify(programInfo.program_config))
          ),
        }
      })
    )
    // @ts-ignore: next line
    // Send the registration transaction and wait for the result.
    const registrationTxResult = this.sendAndWaitFor(registerTx, {
      section: 'registry',
      name: 'AccountRegistered',
    }).catch((error) => {
      if (error.message === 'Event record not found') {
        const { records } = error
        const fails = records.findRecord({
          section: 'registry',
          name: 'FailedRegistration',
        })
        if (fails) throw new Error('Failed to Register')
      } else {
        throw error
      }
    })
    const dataFromEvents = this.#getVerifiyingKeyFromRegisterEvent(
      this.signer.pair.address
    )

    await registrationTxResult
    const verifyingKey = await dataFromEvents
    return verifyingKey
  }
  #getVerifiyingKeyFromRegisterEvent (address: SS58Address): Promise<string> {
    const wantedMethods = ['FailedRegistration', 'AccountRegistered']
    let unsub
    return new Promise(async (res, reject) => {
      unsub = await this.substrate.query.system.events((events) => {
        events.forEach(async (record) => {
          const { event } = record
          const { method } = event
          if (wantedMethods.includes(method.toString())) {
            if (method === wantedMethods[0]) {
              if (event?.data?.toHuman()[0] === address) {
                reject(new Error('Registration Failed'))
                unsub()
              }
            }
            if (method === wantedMethods[1]) {
              if (event?.data?.toHuman()[0] === address) {
                res(event?.data?.toHuman()[1])
                unsub()
              }
            }
          }
        })
      })
    })
  }
}
