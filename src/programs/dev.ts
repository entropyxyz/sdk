import { ApiPromise } from '@polkadot/api'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import * as util from '@polkadot/util'
import ExtrinsicBaseClass from '../extrinsic'
import { Signer } from '../types'
import { hex2buf, stripHexPrefix } from '../utils'

interface ProgramInfoJSON {
  /** The bytecode of the program (as a hex string). */
  bytecode: string
  /** The configuration interface of the program. */
  configurationInterface?: unknown
  /** The address of the deployer of the program. */
  deployer: string
  /** The reference count for the program. */
  refCounter: number
}

/**
 * Represents program information.
 */
export interface ProgramInfo {
  /** The bytecode of the program. */
  bytecode: ArrayBuffer
  /** The configuration interface of the program. */
  configurationInterface?: unknown
  /** The address of the deployer of the program. */
  deployer: string
  /** The reference count for the program. */
  refCounter: number
}

interface ProgramDevOpts {
  // The Substrate API instance
  substrate: ApiPromise
  // The Signer instance
  signer: Signer
}

/**
 * Class to handle program-related extrinsic functions.
 *
 * @extends ExtrinsicBaseClass
 */

class ProgramDev extends ExtrinsicBaseClass {
  #freeTx: boolean
  /**
   * Constructs a ProgramDev instance.
   *
   * @param opts {ProgramDevOpts} - constuctor params
   */

  constructor(opts: ProgramDevOpts) {
    super({
      substrate: opts.substrate,
      signer: opts.signer,
    })

    // this.#freeTx = false
    // HACK: was getting an error about Inability to pay some fees
    this.#freeTx = true
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
    // WARN: why is this JSON? it looks like the next function expects an Object, not JSON!?
    // @ts-ignore next-line .... TODO: remove this
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
    const tx: SubmittableExtrinsic<'promise'> =
      this.substrate.tx.programs.setProgram(
        util.u8aToHex(new Uint8Array(program)),
        formatedConfig
      )

    const record = await this.sendAndWaitFor(tx, this.#freeTx, {
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

    await this.sendAndWaitFor(tx, this.#freeTx, {
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

  #formatProgramInfo(programInfo: ProgramInfoJSON): ProgramInfo {
    const { configurationInterface, deployer, refCounter } = programInfo
    const bytecode = hex2buf(stripHexPrefix(programInfo.bytecode)) // hex string => ArrayBuffer
    return { configurationInterface, deployer, refCounter, bytecode }
  }
}

export default ProgramDev
