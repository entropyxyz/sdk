import ExtrinsicBaseClass from '../extrinsic'
// import { Option, Bool } from '@polkadot/types'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf } from '../utils'
import * as util from '@polkadot/util'

/**
 * @remarks
 * The ProgramManager class provides an interface to interact with Entropy Programs.
 * @alpha
 */
export default class ProgramManager extends ExtrinsicBaseClass {
  /**
   * Creates an instance of ProgramManager.
   * @param {ApiPromise} substrate - Substrate API object
   * @param {Signer} signer - The signer object for the user interfacing with Substrate
   * @remarks
   * The constructor initializes the Substrate api and the signer.
   * @alpha
   */

  constructor ({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ substrate, signer })
    this.substrate = substrate
    this.signer = signer
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
   * @param {string} [programModAccount] - (Optional) The account that will be used to modify the program if different from the signer's account.
   * @param {string} [sigReqAccount=this.signer.wallet.address] - (Optional) The account for which the program will be set or updated. Defaults to the signer's account.
   * @returns {Promise<void>} A promise that resolves when the transaction has been included in the block.
   * @throws {Error} Throws an error if the account is unauthorized or if there's a problem setting the program.
   * @remarks
   * This method handles the conversion of a program from an ArrayBuffer to a hex string
   * It checks for authorization if the programModAccount is provided, ensuring that only authorized accounts can update the bytecode.
   * The transaction is created and sent to Substrate. This method then awaits the confirmation event 'ProgramUpdated' to ensure that the update was successful.
   * @alpha
   */

  async set (
    program: ArrayBuffer,
    programModAccount: string,
    sigReqAccount: string = this.signer.wallet.address
  ): Promise<void> {
    try {
      // Check if the programModAccount is allowed to modify the program
      const isAuthorized = await this.checkAuthorization(sigReqAccount, programModAccount)
      if (!isAuthorized) {
        throw new Error(
          `${programModAccount} is not authorized to modify the program for ${sigReqAccount}`
        )
      }
      const programHex = util.u8aToHex(new Uint8Array(program))
  
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.updateProgram(
        programModAccount,
        programHex
      )
  
      await this.sendAndWaitFor(tx, false, {
        section: 'programs',
        name: 'ProgramUpdated',
      })
    } catch (error) {
      console.error('Error setting program:', error)
      throw error
    }
  }
  
  async checkAuthorization (
    sigReqAccount: string,
    programModAccount: string
  ): Promise<boolean> {
    const result = await this.substrate.query.programs.allowedToModifyProgram(
      sigReqAccount,
      programModAccount
    )
    // seems like the return of value isnt a simple boolean 
    if (result.isSome) {
      const value = result.unwrap()  
      console.log("value", value)
      return Boolean(value)
    } else {
      console.log("No value returned, interpreted as not authorized")
      return false
    }
  } 
}