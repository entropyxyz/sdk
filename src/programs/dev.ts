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
}

async get (programPointer: string | Uint8Array): Promise<ArrayBuffer> {
  // convert programPointer to a format compatible with api
  const programPointerU8a = typeof programPointer === 'string' ? util.hexToU8a(programPointer) : programPointer

  // fetch the latest block hash
  // do i need to do this here? 

  // const blockHash = await this.substrate.rpc.chain.getBlockHash()

  // create an API instance at the specific block hash cuz at is deprecated if we try to do programs.programs.at.. 
  // const apiAtBlockHash = await this.substrate.at(blockHash)

  // maybe can just call directly 
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
  configurationInterface: string | Uint8Array,
  sigReqAccount = this.signer.wallet.address,
  programModKey?: string
): Promise<void> {
  programModKey = programModKey || sigReqAccount

  const isAuthorized = await this.checkAuthorization(programModKey, sigReqAccount)

  if (!isAuthorized) {
    throw new Error('Program modification is not authorized for the given account.')
  }

  // convers program and configurationInterface into a pallatable format
  const programU8a = new Uint8Array(program)
  const configurationInterfaceU8a = typeof configurationInterface === 'string' ? util.stringToU8a(configurationInterface) : configurationInterface

  // programModKey is the caller of the extrinxic 
  const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.setProgram(
    programU8a,
    configurationInterfaceU8a
  )

  await this.sendAndWaitFor(tx, false, {
    section: 'programs',
    name: 'ProgramCreated', 
  })
}

async remove (
  programHash: string | Uint8Array,
  sigReqAccount = this.signer.wallet.address,
  programModKey?: string
): Promise<void> {
  programModKey = programModKey || sigReqAccount

  const isAuthorized = await this.checkAuthorization(programModKey, sigReqAccount)

  if (!isAuthorized) {
    throw new Error('Program modification is not authorized for the given account.')
  }

  // do i need to convert to u8a or just assume we're getting passed a correct hash 

  const programHashU8a = typeof programHash === 'string' ? util.hexToU8a(programHash) : programHash

  const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.programs.removeProgram(
    programHashU8a
  )

  await this.sendAndWaitFor(tx, false, {
    section: 'programs',
    name: 'ProgramRemoved',
  })
}

