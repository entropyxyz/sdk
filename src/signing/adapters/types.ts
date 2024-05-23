import { MsgParams } from '..'
import { Signer } from '../../keys/types/internal'
import { HexString } from '../../keys/types/json'

/**
 * THIS TYPE DENOTES AUXILIARY DATA MUST BE ABLE TO PASS JSON.stringify()
 * Represents auxiliary data that must be JSON serializable.
 */
export interface AUX_DATA {
  [key: string]: unknown
}

/**
 * Represents the result of a pre-sign operation, including the signature request hash
 * and auxiliary data.
 */
export interface PRESIGN_RESULT {
  sigRequestHash: HexString
  auxilary_data: AUX_DATA[] | unknown[]
}

/**
 * Represents an adapter for handling signature requests, including optional pre-sign and
 * post-sign operations.
 */
export interface Adapter {
  type: string
  hash: string
  preSign?: (deviceKey: Signer, sigReq: MsgParams) => Promise<PRESIGN_RESULT>
  postSign?: (sig: Uint8Array, msgParams: MsgParams) => Promise<unknown>
  [key: string]: unknown
}
