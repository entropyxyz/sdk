import { ApiPromise } from '@polkadot/api'
import ExtrinsicBaseClass from '../extrinsic'
import { HexString, SS58Address } from '../keys/types/json'
import { ProgramInstance } from '../programs'
import { Signer } from '../keys/types/internal'
import { Address } from '../types/internal'

export interface RegistrationParams {
  /** initial programs associated with the user */
  programData: ProgramInstance[]
  /** The account authorized to modify programs on behalf of the user. */
  programModAddress?: SS58Address
}

/**
 * Event Type returned by the chain upon success registration
 * */
export interface AccountRegisteredSuccess {
  accountId: Address
  verifyingKey: HexString
}

/**
 * Returned query that show's registration details. Accessible by passing the verifyingKey
 * */
export interface RegisteredInfo {
  programsData: Uint8Array
  programModAddress: SS58Address
  versionNumber: number
}

export type KeyVisibilityInfo = { public: null }

/**
 * the sdk currently only supports 'public' account types from core
 * */


/**
 * The `RegistrationManager` class provides functionality for user registration using Entropy.
 * It extends the `ExtrinsicBaseClass` to handle extrinsic submissions and utility methods.
 *
 * A class to manage the registration of accounts, including handling key visibility and program data.
 */

export default class RegistrationManager extends ExtrinsicBaseClass {
  /**
   * The verification key that corresponds to a registered account.
  */
  verifyingKey: string

  /**
   * Constructs a new instance of the `RegistrationManager` class.
   *
   * @param {ApiPromise} substrate - The Polkadot/Substrate API instance.
   * @param {Signer} signer - The Signer instance.
   * @param verifyingKey - The key verification key that corresponds a registered account.
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
   * @param {RegistrationParams} params - The registration parameters.
   * @param {ProgramInstance[]} params.programData - The initial program data associated with the user.
   * @param {SS58Address} [params.programModAddress] - Optional. The account authorized to modify programs on behalf of the user.
   *
   * @returns {Promise<HexString>} A promise that resolves to the verifying key of the registered account.
   * @throws {Error} If registration information is not found or any other error occurs during registration.
   */

  async register ({
    programModAddress,
    programData,
  }: RegistrationParams): Promise<HexString> {
    // this is sloppy
    // TODO: store multiple signers via SS58Address. and respond accordingly
    // however it should be handled in extrinsic class and not here

    // Convert the program data to the appropriate format and create a registration transaction.
    const registerTx = this.substrate.tx.registry.register(
      programModAddress,
      programData.map(this.#formatProgramInfo)
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

    const result = await registrationTxResult
    // @ts-ignore: not sure where the void is coming from
    const verifyingKey = result.toHuman().event.data[1]
    return verifyingKey
  }

  #formatProgramInfo (programInfo): ProgramInstance {
    const program: ProgramInstance = { program_pointer: programInfo.program_pointer }
    if (programInfo.program_config) program.program_config = Array.from(
      Buffer.from(JSON.stringify(programInfo.program_config))
    )
    return program
  }
}
