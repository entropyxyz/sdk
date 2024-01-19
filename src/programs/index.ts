import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import * as util from '@polkadot/util'

import ExtrinsicBaseClass from '../extrinsic'
import ProgramDevManager from './dev'
import { Signer } from '../types'
import { hex2buf } from '../utils'

/**
 * @remarks
 * The ProgramManager class provides an interface to interact with Entropy Programs.
 * @alpha
 */
export default class ProgramManager extends ExtrinsicBaseClass {
  /**
   * Creates an instance of ProgramManager.
   * @param {ApiPromise} substrate - Substrate API object
   * @param {Signer} programModKey - The signer object for the user interfacing with Substrate
   * @param {Signer} programDeployKey - The signer object for the user interfacing with Substrate
   * @remarks
   * The constructor initializes the Substrate api and the signer.
   * @alpha
   */

  constructor ({
    substrate,
    programModKey,
    programDeployKey,
  }: {
    substrate: ApiPromise
    programModKey: Signer
    programDeployKey?: Signer
  }) {
    super({ substrate, signer })
    this.dev = new ProgramDev(programDeployKey)
  }


  /**
   * Retrieves the program associated with a given sigReqAccount (account)
   * @param {string} sigReqAccount - The account key, defaulting to the signer's wallet address if not provided.
   * @returns {Promise<ArrayBuffer>} - The program as an ArrayBuffer.
   * @throws {Error} If no program is defined for the given account.
   * @remarks
   * This method communicates with Substrate to fetch bytecode associated with an account.
   * The response is then procesed and converted to an ArrayBuffer before being returned
   * @alpha
   */

  async get (sigReqAccount = this.signer.wallet.address): Promise<ArrayBuffer> {
    const responseHexOption = await this.substrate.query.programs.bytecode(
      sigReqAccount
    )
    if (responseHexOption.isEmpty) {
      throw new Error('No program defined for the given account.')
    }
    // @ts-ignore: next line
    const responseHex = responseHexOption.unwrap().toHex() // Get the hex representation
    const byteBuffer = hex2buf(responseHex) // Convert hex string to ArrayBuffer
    return byteBuffer
  }

  /**
   * Sets or updates the program of a specified account on Substrate
   * This method allows the current signer or an authorized account to update the program associated with the signer's account or another specified account.
   * @param {ArrayBuffer} program - The program to be set or updated, as an ArrayBuffer.
   * @param {string} [programModKey] - Optional. An authorized account to modify the program, if different from the signer's account.
   * @param {string} [sigReqAccount=this.signer.wallet.address] -The account for which the program will be set or updated. Defaults to the signer's account.
   * @returns {Promise<void>} A promise that resolves when the transaction has been included in the block.
   * @throws {Error} Throws an error if the account is unauthorized or if there's a problem setting the program.
   * @remarks
   * This method handles the conversion of a program from an ArrayBuffer to a hex string
   * It checks for authorization if the programModKey is provided, ensuring that only authorized accounts can update the bytecode.
   * The transaction is created and sent to Substrate. This method then awaits the confirmation event 'ProgramUpdated' to ensure that the update was successful.
   * @alpha
   */

  async set (
    program: ArrayBuffer,
    sigReqAccount = this.signer.wallet.address,
    programModKey?: string
  ): Promise<void> {
    programModKey = programModKey || sigReqAccount
  
    const isAuthorized = await this.checkAuthorization(programModKey, sigReqAccount)
  
    if (!isAuthorized) {
      throw new Error('Program modification is not authorized for the given account.')
    }
  
    const programHex = util.u8aToHex(new Uint8Array(program))
  
    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.updateProgram(
      programModKey,
      programHex
    )
  
    await this.sendAndWaitFor(tx, false, {
      section: 'programs',
      name: 'ProgramUpdated',
    })
  }
  /**
   *  Checks if a given program modification account is authorized to modify the program associated with a specific signature request account.
   *
   * @param {string} sigReqAccount - The account for which the program modification is intended.
   * @param {string} programModKey - The account whose authorization is to be verified.
   * @returns {Promise<boolean>} - A promise that resolves if the `programModKey` is authorized to modify the program for `sigReqAccount`
   * @remarks
   * This method queries Substrate  to determine if the `programModKey` is allowed to modify the program associated with the `sigReqAccount`.
   * The method utilizes the `allowedToModifyProgram` quert, which returns an optional value. If the value is present (`isSome`), it indicates authorization.
   * (I'm not sure about this as the blob that's returned is extremely long )
   * The method unwraps the optional value
   * @example
   * ```typescript
   * const isAuthorized = await checkAuthorization('5FHneW46...HgYb3fW', '5DAAnrj7...P5JT7zP')
   * console.log(isAuthorized) // Outputs: true or false
   * ```
   */

  async checkAuthorization (
    programModKey: string,
    sigReqAccount: string
  ): Promise<boolean> {
    try {
      const result = await this.substrate.query.programs.allowedToModifyProgram(
        programModKey,
        sigReqAccount
      )
      return !result.isEmpty
    } catch (error) {
      console.error('Error in checkAuthorization:', error)
      return false
    }
  }
}
