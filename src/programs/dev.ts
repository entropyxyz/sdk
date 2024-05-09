import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf, stripHexPrefix } from '../utils'
import * as util from '@polkadot/util'

/**
 * Represents program information.
 *
 * @interface ProgramInfo
 * @property {ArrayBuffer} bytecode - The bytecode of the program.
 * @property {unknown} [configurationInterface] - Optional. The configuration interface of the program.
 * @property {string} deployer - The address of the deployer of the program.
 * @property {number} refCounter - The reference count for the program.
 */

// interfaceDescription needs better design and another type other than 'unknown'
export interface ProgramInfo {
  bytecode: ArrayBuffer
  interfaceDescription?: unknown
  deployer: string
  refCounter: number
}

/**
 * Class to handle program-related extrinsic functions.
 *
 * @extends ExtrinsicBaseClass
 */

export default class ProgramDev extends ExtrinsicBaseClass {
  /**
   * Constructs a ProgramDev instance.
   *
   * @param {ApiPromise} substrate - The Substrate API instance.
   * @param {Signer} signer - The Signer instance.
   */

  constructor({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ substrate, signer })
  }

  /**
   * Retrieves program information using a program pointer.
   *
   * @param {string} pointer - The program pointer.
   * @returns {Promise<ProgramInfo>} - A Promise resolving to the program information.
   */

  async get(pointer: string): Promise<ProgramInfo> {
    // fetch program bytecode using the program pointer at the specific block hash
    const responseOption = await this.substrate.query.programs.programs(pointer)

    const programInfo = responseOption.toJSON()

    return this.#formatProgramInfo(programInfo)
  }

  /**
   * Deploys a new program.
   *
   * @param {ArrayBuffer} program - The program to deploy.
   * @param {unknown} [configurationInterface] - Optional. The configuration interface of the program.
   * @returns {Promise<string>} - A Promise resolving to the hash of the deployed program.
   */

  async deploy(
    program: ArrayBuffer,
    configurationInterface?: unknown
  ): Promise<string> {
    // converts program and configurationInterface into a palatable format
    const formatedConfig = JSON.stringify(configurationInterface)
    // programModKey is the caller of the extrinsic
    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.setProgram(
      util.u8aToHex(new Uint8Array(program)), // new program
      formatedConfig, // config schema
      '', // auxilary config schema
      [] // oracle data pointer
    )
    const record = await this.sendAndWaitFor(tx, {
      section: 'programs',
      name: 'ProgramCreated',
    })
    const programHash = record.event.data[1].toHex()

    return programHash
  }

  /**
   * Removes a program.
   *
   * @param {string | Uint8Array} programHash - The hash of the program to remove.
   * @returns {Promise<void>} - A Promise resolving when the program is removed.
   */

  async remove(programHash: string | Uint8Array): Promise<void> {
    const tx: SubmittableExtrinsic<'promise'> =
      this.substrate.tx.programs.removeProgram(programHash)

    await this.sendAndWaitFor(tx, {
      section: 'programs',
      name: 'ProgramRemoved',
    })
  }

  /**
   * @internal
   *
   * Formats program information.
   *
   * @param {ProgramInfoJSON} programInfo - The program information in JSON format.
   * @returns {ProgramInfo} - The formatted program information.
   */
  #formatProgramInfo (programInfo): ProgramInfo {
    const { interfaceDescription, deployer, refCounter } = programInfo
    const bytecode = hex2buf(stripHexPrefix(programInfo.bytecode)) // Convert hex string to ArrayBuffer
    return { interfaceDescription, deployer, refCounter, bytecode }
  }
}
