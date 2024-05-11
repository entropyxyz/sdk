import { MsgParams } from '..'
import { Signer } from '../../keys/types/internal'
import { HexString } from '../../keys/types/json'

/**
 * THIS TYPE DENOTES AUXILARY DATA MUST BE ABLE TO PASS JSON.stringify()
 */
export interface AUX_DATA {
  [key: string]: unknown 
}
export interface PRESIGN_RESULT {
  sigRequestHash: HexString
  auxiliaryData: AUX_DATA[]

}
export interface Adapter {
  type: string
  hash: string
  preSign: (deviceKey: Signer, sigReq: MsgParams) => Promise<PRESIGN_RESULT>
  postSign: (sig: Uint8Array, msgParams: MsgParams) => Promise<unknown>
}

export interface OptAdapter {
  type: string
  hash?: string
  preSign?: (sigReq: MsgParams) => Promise<string>
  postSign?: (sig: Uint8Array, msgParams: MsgParams) => Promise<unknown>
}
