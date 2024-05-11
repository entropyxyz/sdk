import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import ExtrinsicBaseClass from '../extrinsic'
import ProgramDev from './dev'
import { Signer } from '../keys/types/internal'

export interface ProgramInstance {
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
   * @param {Signer} deployer - The signer object for the user interfacing with Entropy.
   * @param verifyingKey - The key verification key that corresponds to a signer.

   * @remarks
   * The constructor initializes the Substrate api and the signer.
   * @alpha
   */
  dev: ProgramDev

  constructor ({
    substrate,
    deployer,
    programModKey,
  }: {
    substrate: ApiPromise
    deployer: Signer
    programModKey: Signer
  }) {
    super({ substrate, signer: programModKey })
    this.dev = new ProgramDev({substrate, signer: deployer})
  }
  get verifyingKey () {
    return this.signer.verifyingKeys ? this.signer.verifyingKeys[0] : undefined
  }
  /**
   * Retrieves the program associated with a given programModKey (account)
   * @param {string} programModAccount - The account key, defaulting to the signer's wallet address if not provided.
   * @returns {Promise<ArrayBuffer>} - The program as an ArrayBuffer.
   * @throws {Error} If no program is defined for the given account.
   * @remarks
   * This method communicates with Substrate to fetch bytecode associated with an account.
   * The response is then processed and converted to an ArrayBuffer before being returned
   * @alpha
   */


  async get (verifyingKey: string): Promise<ProgramInstance[]> {
    const registeredOption = await this.substrate.query.registry.registered(
      verifyingKey
        )

    if (registeredOption.isEmpty) {
      throw new Error(`No programs found for account: ${verifyingKey}`)
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
   * @param {string} [programModAccount=this.signer.address] - The account for which the programs will be updated. Defaults to the signer's account.
   * @param {string} [deployer] - Optional. An authorized account to modify the programs, if different from the signer's account.
   * @returns {Promise<void>} - A Promise that resolves when the programs are successfully updated.
   * @throws {Error} - If the account is unauthorized or there's a problem updating the programs.
   * @remarks
   * This method replaces the existing programs of an account with a new set. It checks for authorization and sends a transaction to update the state.
   * @alpha
   */

  async set (
    verifyingKey: string = this.verifyingKey,
    newList: ProgramInstance[],
  ): Promise<void> {
    const registeredInfoOption = await this.substrate.query.registry.registered(
      verifyingKey
    )

    if (registeredInfoOption.isEmpty) {
      throw new Error(`Account not registered: ${verifyingKey}`)
    }

    const registeredInfo = registeredInfoOption.toJSON()
    // @ts-ignore: next line :{
    const isAuthorized = registeredInfo.deployer === deployer
    if (!isAuthorized) {
      throw new Error(`Unauthorized modification attempt by ${verifyingKey}`)
    }

    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.registry.changeProgramInstance(
      verifyingKey,
      newList.map(({ programPointer, programConfig }) => ({ programPointer, programConfig }))
    )
    await this.sendAndWaitFor(tx, {
      section: 'registry',
      name: 'ProgramInfoChanged',
    })
  }

  /**
   * Removes a specific program from an account.
   * @param {string | Uint8Array} programHashToRemove - The hash of the program to remove.
   * @param {string} [programModKey=this.signer.address] - The account from which the program will be removed. Defaults to the signer's account.
   * @param {string} [programDeployer] - Optional. The authorized account to perform the removal, if different from the signer's account.
   * @returns {Promise<void>} - A Promise resolving when the program is successfully removed.
   * @remarks
   * This method removes a specified program from an account's associated programs. It filters out the specified program and updates the state with the remaining programs.
   * @alpha
   */

  async remove(
    programHashToRemove: string,
    programModKey,
    verifyingKey
  ): Promise<void> {
    const currentPrograms = await this.get(verifyingKey)
    // creates new array that contains all of the currentPrograms except programHashToRemove
    const updatedPrograms = currentPrograms.filter(
      program => program.programPointer !== programHashToRemove
    );


    await this.set(programModKey, updatedPrograms)
  }

  /**
   * Adds a new program for a specific account.
   * @param {ProgramData} newProgram - The new program data to add.
   * @param {string} [programModKey=this.signer.address] - The account to add the program to. Defaults to the signer's account.
   * @param {string} [programDeployer] - Optional. The authorized account to modify the program, if different from the signer's account.
   * @returns {Promise<void>} - A promise that resolves when the program is successfully added.
   * @remarks
   * This method fetches the current programs of an account, adds the new program, and updates the state with the new set of programs.
   * It ensures the operation is performed by an authorized account.
   * @alpha
   */

  async add (
    newProgram: ProgramInstance,
    programModKey,
    verifyingKey:string = this.verifyingKey[0]
  ): Promise<void> {
    const currentPrograms = await this.get(verifyingKey)
       await this.set(programModKey, [...currentPrograms, newProgram]);

  }
}
