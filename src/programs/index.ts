import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import ExtrinsicBaseClass from '../extrinsic'
import ProgramDev from './dev'
import { Signer } from '../types'

export interface ProgramData {
  programPointer: string
  programConfig?: unknown
}

/**
 * @remarks
 * The ProgramManager class provides an interface to interact with Entropy Programs.
 * @alpha
 */
export default class ProgramManager extends ExtrinsicBaseClass {
  /**
   * Creates an instance of ProgramManager.
   * @param {ApiPromise} substrate - Substrate API object
   * @param {Signer} programModKey - The signer object for the user interfacing with Entropy
   * @param {Signer} programDeployKey - The signer object for the user interfacing with Entropy
   * @remarks
   * The constructor initializes the Substrate api and the signer.
   * @alpha
   */
  dev: ProgramDev
  constructor ({
    substrate,
    programModKey,
    programDeployKey,
  }: {
    substrate: ApiPromise
    programModKey: Signer
    programDeployKey?: Signer
  }) {
    super({ substrate, signer: programModKey })
    this.dev = new ProgramDev({substrate, signer: programDeployKey})
  }

  /**
   * Retrieves the program associated with a given sigReqAccount (account)
   * @param {string} sigReqAccount - The account key, defaulting to the signer's wallet address if not provided.
   * @returns {Promise<ArrayBuffer>} - The program as an ArrayBuffer.
   * @throws {Error} If no program is defined for the given account.
   * @remarks
   * This method communicates with Substrate to fetch bytecode associated with an account.
   * The response is then processed and converted to an ArrayBuffer before being returned
   * @alpha
   */

  async get (sigReqAccount: string): Promise<ProgramData[]> {
    const registeredOption = await this.substrate.query.relayer.registered(
      sigReqAccount
    )

    if (registeredOption.isEmpty) {
      throw new Error(`No programs found for account: ${sigReqAccount}`)
    }

    const registeredInfo = registeredOption.toJSON()
    // @ts-ignore: next line :{
    return (registeredInfo.programsData || []).map((program) => ({
      // pointer: program.pointer.toString(),
      programPointer: program.programPointer,
      // double check on how we're passing config
      programConfig: program.programConfig,
    }))
  }

  /**
   * Sets or updates the program of a specified account on Entropy.
   * This method allows the current signer or an authorized account to update the program associated with the signer's account or another specified account.
   * @param {ArrayBuffer} program - The program to be set or updated, as an ArrayBuffer.
   * @param {string} [programModKey] - Optional. An authorized account to modify the program, if different from the signer's account.
   * @param {string} [sigReqAccount=this.signer.wallet.address] -The account for which the program will be set or updated. Defaults to the signer's account.
   * @returns {Promise<void>} A promise that resolves when the transaction has been included in the block.
   * @throws {Error} Throws an error if the account is unauthorized or if there's a problem setting the program.
   * @remarks
   * This method handles the conversion of a program from an ArrayBuffer to a hex string.
   * It checks for authorization if the programModKey is provided, ensuring that only authorized accounts can update the bytecode.
   * The transaction is created and sent to Entropy. This method then awaits the confirmation event 'ProgramUpdated' to ensure that the update was successful.
   * @alpha
   */


  async set (
    newList: ProgramData[],
    sigReqAccount = this.signer.wallet.address,
    programModKey?: string
  ): Promise<void> {
    programModKey = programModKey || sigReqAccount

    const registeredInfoOption = await this.substrate.query.relayer.registered(
      sigReqAccount
    )

    if (registeredInfoOption.isEmpty) {
      throw new Error(`Account not registered: ${sigReqAccount}`)
    }
    
    const registeredInfo = registeredInfoOption.toJSON()
    // @ts-ignore: next line :{
    const isAuthorized = registeredInfo.programModificationAccount === programModKey

    if (!isAuthorized) {
      throw new Error(`Unauthorized modification attempt by ${programModKey}`)
    }

    const newProgramInstances = newList.map((data) => ({
      programPointer: data.programPointer,
      programConfig: data.programConfig,
    }))

    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.relayer.changeProgramInstance(
      sigReqAccount,
      newProgramInstances
    )

    await this.sendAndWaitFor(tx, false, {
      section: 'relayer',
      name: 'ProgramInfoChanged',
    })
  }

  async remove (
    programHashToRemove: string,
    sigReqAccount = this.signer.wallet.address,
    programModKey?: string
  ): Promise<void> {
    const currentPrograms = await this.get(sigReqAccount)
    // creates new array that contains all of the currentPrograms except programHashToRemove
    const updatedPrograms = currentPrograms.filter(
      (program) => program.programPointer !== programHashToRemove
    )
    await this.set(updatedPrograms, sigReqAccount, programModKey)
  }

  async add (
    newProgram: ProgramData,
    sigReqAccount = this.signer.wallet.address,
    programModKey?: string
  ): Promise<void> {
    const currentPrograms = await this.get(sigReqAccount)
    await this.set(
      [...currentPrograms, newProgram],
      sigReqAccount,
      programModKey
    )
  }
}
