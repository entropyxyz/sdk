import ExtrinsicBaseClass from '../extrinsic'
import { Option, Bool } from '@polkadot/types'
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
      const isAuthorized = await this.checkAuthorization(
        sigReqAccount,
        programModAccount
      )
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

  /**
   * Sets or revokes the authorization for a given account to modify the program associated with another account.
   * @param {string} sigReqAccount - The account for which the program will be modified.
   * @param {string} programModAccount - The account that is being authorized or revoked.
   * @param {boolean} isAuthorized - Flag to set or revoke authorization.
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue setting the authorization.
   * @remarks
   * This method creates a transaction to set or revoke the authorization for an account to modify the program of another account on Substrate.
   * It uses the `setAuthorization` extrinsic from the Substrate pallet.
   * @alpha
   */

  async setAuthorization (
    sigReqAccount: string,
    programModAccount: string,
    isAuthorized: boolean
  ): Promise<void> {
    try {
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.setAuthorization(
        sigReqAccount,
        programModAccount,
        isAuthorized
      )
      await this.sendAndWaitFor(tx, false, {
        section: 'programs',
        name: 'AuthorizationSet',
      })
    } catch (error) {
      console.error('Error setting authorization:', error)
      throw error
    }
  }

  async checkAuthorization (
    ownerAccount: string,
    delegateAccount: string
  ): Promise<boolean> {
    // Get authorization status from Substrate
    const authorizationStatus: Option<Bool> = ((await this.substrate.query.programs.getAuthorizationStatus(
      ownerAccount,
      delegateAccount
    )) as unknown) as Option<Bool>

    // Check if the Option is populated with a value
    if (authorizationStatus.isSome) {
      // Unwrap the value to get the actual authorization status
      return authorizationStatus.unwrap().toJSON()
    } else {
      // If no value, it means no authorization has been set, so return false.
      return false
    }
  }

}

// REGISTRATION TODO: 
// i think the above implementation will require us to add programModAccount to register
// before registering we then run setAuthorization on behalf of the sigReqAccount and assign a delegated programModAccount
// then a programModAccount can set and update programs post register without having to do any set authorization extrinsics
// may not be possible to set an authorization of a programModAccount on a sigReqAccount before it is even registered to entropy

// PROGRAMS DEPOSIT TODO: 
// need to expand deposit + setting to include reserveProgramDeposit, unreserveProgramDeposit, updateProgramStorageDeposit based on:
// https://github.com/entropyxyz/entropy-core/blob/master/pallets/programs/src/lib.rs#L102

// INITIAL ESTIMATE

/**
   * Estimate the transaction fee for updating a program.
   * @param {ArrayBuffer} program - The program to be set or updated, as an ArrayBuffer.
   * @param {string} [programModAccount] - (Optional) The account that will be used to modify the program if different from the signer's account.
   * @param {string} [sigReqAccount=this.signer.wallet.address] - (Optional) The account for which the program will be set or updated. Defaults to the signer's account.
   * @returns {Promise<string>} - Estimated transaction fee in a human-readable format.
   * @throws {Error} If there's an issue with estimating the fee.
   * @remarks
   * This method creates a simulated transaction to update a program and estimates the fee that would be charged if the program were to be submitted.
   * Allows the specification of a program modification account separate from the signer's account.
   * @alpha
   */

// async estimateProgramDepositFee (
//   program: ArrayBuffer,
//   programModAccount?: string,
//   sigReqAccount: string = this.signer.wallet.address
// ): Promise<string> {
//   try {
//     const accountToUse = programModAccount || sigReqAccount
//     const programHex = util.u8aToHex(new Uint8Array(program))
//     const tx = this.substrate.tx.programs.updateProgram(
//       accountToUse,
//       programHex
//     )

//     const paymentInfo = await tx.paymentInfo(accountToUse)
//     return paymentInfo.partialFee.toHuman()
//   } catch (error) {
//     console.error('Error estimating program update fee:', error)
//     throw error
//   }
// }