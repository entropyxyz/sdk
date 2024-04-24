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
   * @param {ApiPromise} substrate - Substrate API object.
   * @param {Signer} programModKey - The signer object for the user interfacing with Entropy.
   * @param {Signer} programDeployKey - The signer object for the user interfacing with Entropy.
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
    this.dev = new ProgramDev({ substrate, signer: programDeployKey })
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
   * Updates the programs of a specified account.
   * @param {ProgramData[]} newList - Array of new program data to set.
   * @param {string} [sigReqAccount=this.signer.wallet.address] - The account for which the programs will be updated. Defaults to the signer's account.
   * @param {string} [programModKey] - Optional. An authorized account to modify the programs, if different from the signer's account.
   * @returns {Promise<void>} - A Promise that resolves when the programs are successfully updated.
   * @throws {Error} - If the account is unauthorized or there's a problem updating the programs.
   * @remarks
   * This method replaces the existing programs of an account with a new set. It checks for authorization and sends a transaction to update the state.
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
    const isAuthorized =
      // @ts-ignore: next line :{
      registeredInfo.programModificationAccount === programModKey

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

  /**
   * Removes a specific program from an account.
   * @param {string | Uint8Array} programHashToRemove - The hash of the program to remove.
   * @param {string} [sigReqAccount=this.signer.wallet.address] - The account from which the program will be removed. Defaults to the signer's account.
   * @param {string} [programModKey] - Optional. The authorized account to perform the removal, if different from the signer's account.
   * @returns {Promise<void>} - A Promise resolving when the program is successfully removed.
   * @remarks
   * This method removes a specified program from an account's associated programs. It filters out the specified program and updates the state with the remaining programs.
   * @alpha
   */

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

  /**
   * Adds a new program for a specific account.
   * @param {ProgramData} newProgram - The new program data to add.
   * @param {string} [sigReqAccount=this.signer.wallet.address] - The account to add the program to. Defaults to the signer's account.
   * @param {string} [programModKey] - Optional. The authorized account to modify the program, if different from the signer's account.
   * @returns {Promise<void>} - A promise that resolves when the program is successfully added.
   * @remarks
   * This method fetches the current programs of an account, adds the new program, and updates the state with the new set of programs.
   * It ensures the operation is performed by an authorized account.
   * @alpha
   */

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
