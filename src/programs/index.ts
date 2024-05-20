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
 * The ProgramManager class provides an interface that manages program instances, providing methods to get, set, add, and remove programs.
 * @alpha
 */
export default class ProgramManager extends ExtrinsicBaseClass {
  /**
   * Creates an instance of ProgramManager.
   * @param {ApiPromise} substrate - Substrate API object.
   * @param {Signer} deployer - The signer object for the user interfacing with Entropy.
   * @param {Signer} programModKey - The Signer instance for modifying programs.
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
    this.dev = new ProgramDev({ substrate, signer: deployer })
  }

  /**
   * Retrieves the verifying key of the signer.
   *
   * @returns {string | undefined} The first verifying key if available, otherwise undefined.
   */

  get verifyingKey () {
    return this.signer.verifyingKeys ? this.signer.verifyingKeys[0] : undefined
  }

  /**
   * Retrieves the program associated with a given programModKey (account)
   * @param {string} verifyingKey - The account key, defaulting to the signer's wallet address if not provided.
   * @returns {Promise<ProgramInstance[]>} A promise that resolves to the list of program instances.
   * @throws {Error} If no programs are found for the account.
   * @remarks
   * This method communicates with Entropy to fetch bytecode associated with an account.
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
   * Sets the list of program instances for a verifying key.
   * @param {string} verifyingKey - The verifying key of the account.
   * @param {ProgramInstance[]} newList - The new list of program instances.
   * @returns {Promise<void>} - A Promise that resolves when the programs are successfully updated.
   * @throws {Error} If the account is not registered or the modification is unauthorized.
   * @remarks
   * This method replaces the existing programs of an account with a new set. It checks for authorization and sends a transaction to update the state.
   * @alpha
   */

  async set (
    verifyingKey: string = this.verifyingKey,
    newList: ProgramInstance[]
  ): Promise<void> {
    const verifiyingKeysForAddress =
      await this.substrate.query.registry.modifiableKeys(
        this.signer.pair.address
      )

    // @ts-ignore: next-line ... polkadot js anyjson type but his hould always be an array or what ever
    if (!verifiyingKeysForAddress.toJSON().length) {
      throw new Error(`Account not registered for: ${verifyingKey}`)
    }

    // @ts-ignore: next line :{
    const isAuthorized = (
      verifiyingKeysForAddress.toJSON() as string[]
    ).includes(verifyingKey)
    if (!isAuthorized) {
      throw new Error(`Unauthorized modification attempt by ${verifyingKey}`)
    }

    const tx: SubmittableExtrinsic<'promise'> =
      this.substrate.tx.registry.changeProgramInstance(
        verifyingKey,
        newList.map(({ programPointer, programConfig }) => ({
          programPointer,
          programConfig,
        }))
      )
    await this.sendAndWaitFor(tx, {
      section: 'registry',
      name: 'ProgramInfoChanged',
    })
  }

  /**
   * Removes a specific program from an account.
   * @param {string | Uint8Array} programHashToRemove - The hash of the program to remove.
   * @param {Signer} programModKey - The Signer instance for modifying programs.
   * @param {string} verifyingKey - The verifying key of the account.
   * @returns {Promise<void>} - A Promise resolving when the program is successfully removed.
   * @remarks
   * This method removes a specified program from an account's associated programs. It filters out the specified program and updates the state with the remaining programs.
   * @alpha
   */

  async remove (
    programHashToRemove: string,
    // programModKey = this.signer.pair.address,
    verifyingKey = this.verifyingKey
  ): Promise<void> {
    const currentPrograms = await this.get(verifyingKey)
    // creates new array that contains all of the currentPrograms except programHashToRemove
    const updatedPrograms = currentPrograms.filter(
      (program) => program.programPointer !== programHashToRemove
    )

    await this.set(verifyingKey, updatedPrograms)
    // this.signer.verifyingKeys = this.signer.verifyingKeys.reduce(
    //   (agg, pointer): string[] => {
    //     if (pointer === programHashToRemove) return agg
    //     agg.push(pointer)
    //     return agg
    //   },
    //   []
    // )
  }

  /**
   * Adds a new program for a specific account.
   * @param {ProgramData} newProgram - The new program data to add.
   * @param {string} verifyingKey - The verifying key of the account.
   * @returns {Promise<void>} A promise that resolves when the program is added.
   * @remarks
   * This method fetches the current programs of an account, adds the new program, and updates the state with the new set of programs.
   * It ensures the operation is performed by an authorized account.
   * @alpha
   */

  async add (
    newProgram: ProgramInstance,
    verifyingKey: string = this.verifyingKey
  ): Promise<void> {
    const currentPrograms = await this.get(verifyingKey)
    await this.set(verifyingKey, [...currentPrograms, newProgram])
  }
}
