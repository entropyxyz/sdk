import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf } from '../utils'
import * as util from '@polkadot/util'


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

  async get (programPointer: string | Uint8Array): Promise<ArrayBuffer> {
    // convert programPointer to a format compatible with api
    const programPointerU8a = typeof programPointer === 'string' ? util.hexToU8a(programPointer) : programPointer

    // fetch program bytecode using the program pointer at the specific block hash
    const responseOption = await this.substrate.query.programs.programs(programPointerU8a)

    if (responseOption.isNone) {
      throw new Error(`No program defined for the given pointer: ${programPointer}`)
    }

    const programInfo = responseOption.unwrap()
    const bytecode = programInfo.bytecode

    const byteBuffer = bytecode instanceof Uint8Array ? bytecode.buffer : new Uint8Array(bytecode).buffer

    return byteBuffer
  }


  async set (
    program: ArrayBuffer,
    configurationInterface?: unknown,
  ): Promise<string> {

    // converts program and configurationInterface into a palatable format
    const programU8a = new Uint8Array(program)
    const formatedConfig = JSON.stringify(configurationInterface)
    // programModKey is the caller of the extrinsic
    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.setProgram(
      programU8a,
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
}