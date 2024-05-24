import { HexString } from '../../keys/types/json'
import { Signer } from '../../keys/types/internal'
import { AUX_DATA, PRESIGN_RESULT } from './types'
import { toHex } from '../../utils'



/**
 *
 * The auxilary_data needed
 *
 * */

export type NoopAuxData = null


/**
 * convenience object
 * */

export const PROGRAM_INTERFACE = {
  // change this in file. this is peg's noop program. wasam path: @entropyxyz/sdk/tests/testing-utils/program_noop.wasm
  program_pointer: '0x6c8228950ca8dfb557d42ce11643c67ba5a3e5cee3ce7232808ea7477b846bcb',
  program_config: null,
  auxilary_data: [
    null
  ],
}

export const ADAPTER_PROGRAMS = [PROGRAM_INTERFACE]

export interface PreSignResult extends PRESIGN_RESULT {
  sigRequestHash: HexString
  auxilary_data: NoopAuxData[]
}

export async function preSign (
  _: Signer,
  message: unknown
): Promise<PreSignResult> {
  const stringMessage = JSON.stringify(message)
  // un comment for device key signature:
  // const signedMessage = deviceKey.pair.sign(stringMessage)
  const sigRequestHash = toHex(stringMessage)


  return { sigRequestHash, auxilary_data: PROGRAM_INTERFACE.auxilary_data }
}

export const type = 'noop'
// THIS IS THE RETURNED SIG HASH
export const hash = 'sha3'
