import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../keys/types/internal'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hexStringToBuffer, stripHexPrefix, hexStringToJSON } from '../utils'
import * as util from '@polkadot/util'
import { HexString } from '../keys/types/json'

/**
 * Represents program information.
 *
 * @interface ProgramInterface
 * @property {ArrayBuffer} bytecode - The bytecode of the program.
 * @property {unknown} [interfaceDescription] - Optional. The configuration interface of the program.
 * @property {string} deployer - The address of the deployer of the program.
 * @property {number} refCounter - The reference count for the program.
 */

// interfaceDescription needs better design and another type other than 'unknown'
export interface ProgramInterface {
  bytecode: ArrayBuffer
  configurationSchema: unknown
  auxiliaryDataSchema: unknown
  // not quite supported yet
  // oracleDataPointer?: []
  // keeping out of the interface untill tss node does something with it
  // versionNumber: number
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

  constructor ({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ substrate, signer })
  }

  /**
   * Retrieves all programs for a given address.
   * 
   * @param {string} address - SS58 Address
   * @returns {Promise<string[]>} A promise that resolves to the list of program pointers
   */

  async getByDeployer (address: string): Promise<any> {
    const programs = await this.substrate.query.programs.ownedPrograms(address);
    return programs.toHuman()
  }

  /**
   * Retrieves program information using a program pointer.
   *
   * @param {string} pointer - The program pointer to fetch the program bytecode.
   * @returns {Promise<ProgramInterface>} A promise that resolves to the program information.
   */

  async get (pointer: string): Promise<ProgramInterface> {
    // fetch program bytecode using the program pointer at the specific block hash
    if (pointer.length <= 48) throw new Error('pointer length is less then or equal to 48. are you using an address?')
    const responseOption = await this.substrate.query.programs.programs(pointer)

    const programInfo = responseOption.toJSON()

    return this.#formatProgramInterface(programInfo)
  }

  /**
   * Deploys a new program.
   *
   * @param {ArrayBuffer} program - The program bytecode to deploy.
   * @param {unknown} configurationSchema - The configuration schema for the program.
   * @param {unknown} auxiliaryDataSchema - The auxiliary data schema for the program.
   * @param {[]} oracleDataPointer - The oracle data pointer // not currently supported
   * @returns {Promise<HexString>} A promise that resolves to the hash of the deployed program.
   */

  async deploy (
    program: ArrayBuffer,
    configurationSchema?: unknown,
    auxiliaryDataSchema?: unknown
    // not quite supported yet
    // oracleDataPointer?: []
  ): Promise<HexString> {
    // converts program and configurationInterface into a palatable format
    const formatedConfig = JSON.stringify(configurationSchema)
    const formatedAuxData = JSON.stringify(auxiliaryDataSchema)
    // programModKey is the caller of the extrinsic
    const tx: SubmittableExtrinsic<'promise'> =
      this.substrate.tx.programs.setProgram(
        util.u8aToHex(new Uint8Array(program)), // new program
        formatedConfig, // config schema
        formatedAuxData, // auxilary config schema
        [], // oracleDataPointer // oracle data pointer
        0
      )
    const record = await this.sendAndWaitFor(tx, {
      section: 'programs',
      name: 'ProgramCreated',
    })
    const programHash = record.event.data[1].toHex()

    return programHash
  }

  /**
   * Removes an existing program.
   *
   * (removing a program is currently unstable and may not remove the program from chain as intended.)
   *
   * @param {string | Uint8Array} programHash - The hash of the program to remove.
   * @returns {Promise<void>} A promise that resolves when the program is removed.
   */

  async remove (programHash: string | Uint8Array): Promise<void> {
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
   * trys to parse schema as a json. If fails because it's not a json returns original schema. throws for any other reason
   *
   * @param {any} programInfo - The program information in JSON format.
   * @returns {unknown} - The formatted program information.
   */
  #tryParseSchema (schema: any): unknown {
    try {
      return hexStringToJSON(schema)
    } catch (e) {
      if (e.message.includes('is not valid JSON')) return schema
      throw e
    }
  }

  /**
   * @internal
   *
   * Formats program information.
   *
   * @param {ProgramInterfaceJSON} programInfo - The program information in JSON format.
   * @returns {ProgramInterface} - The formatted program information.
   */

  #formatProgramInterface (programInfo): ProgramInterface {
    const { deployer, refCounter } = programInfo
    const bytecode = hexStringToBuffer(stripHexPrefix(programInfo.bytecode)) // Convert hex string to ArrayBuffer
    const configurationSchema = this.#tryParseSchema(programInfo.configurationSchema)
    const auxiliaryDataSchema = this.#tryParseSchema(programInfo.auxiliaryDataSchema)
    return {
      configurationSchema,
      auxiliaryDataSchema,
      deployer,
      refCounter,
      bytecode,
    }
  }
}
