import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf, stripHexPrefix } from '../utils'
import * as util from '@polkadot/util'

export interface ProgramInfoJSON {
  bytecode: string
  configurationInterface?: unknown
  deployer: string
  refCounter: number
}

export interface ProgramInfo {
  bytecode: ArrayBuffer
  configurationInterface?: unknown
  deployer: string
  refCounter: number
}

export default class ProgramDev extends ExtrinsicBaseClass {
  constructor ({
    substrate,
    signer
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ substrate, signer })
  }

  async get (programPointer: string): Promise<ProgramInfo> {
    // fetch program bytecode using the program pointer at the specific block hash
    const responseOption = await this.substrate.query.programs.programs(programPointer)

    if (responseOption.isNone) {
      throw new Error(`No program defined for the given pointer: ${programPointer}`)
    }

    const programInfo = responseOption.toJSON()

    return this.#formatProgramInfo(programInfo)
  }


  async deploy (
    program: ArrayBuffer,
    configurationInterface?: unknown,
  ): Promise<string> {

    // converts program and configurationInterface into a palatable format
    const programU8a = new Uint8Array(program)
    const formatedConfig = JSON.stringify(configurationInterface)
    // programModKey is the caller of the extrinsic
    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.setProgram(
      util.u8aToHex(new Uint8Array(program)),
      formatedConfig
    )

    const record = await this.sendAndWaitFor(tx, false, {
      section: 'programs',
      name: 'ProgramCreated',
    })
    const programHash  = record.event.data[1].toHex()

    return programHash
  }

  async remove (
    programHash: string | Uint8Array,
  ): Promise<void> {    const programHashU8a = typeof programHash === 'string' ? util.hexToU8a(programHash) : programHash

    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.removeProgram(
      programHash
    )

    await this.sendAndWaitFor(tx, false, {
      section: 'programs',
      name: 'ProgramRemoved',
    })
  }

  #formatProgramInfo (programInfo): ProgramInfo {
    const { configurationInterface, deployer, refCounter } = programInfo
    const bytecode = hex2buf(stripHexPrefix(programInfo.bytecode)) // Convert hex string to ArrayBuffer
    return { configurationInterface, deployer, refCounter, bytecode }
  }
}