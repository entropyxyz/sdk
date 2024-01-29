import { Arch } from '../../types'
import { TxParams } from '..'
export interface Adapter {
  type: string
  arch: Arch
  hash: string
  preSign: (sigReq: TxParams) => Promise<string>
  postSign: (sig: Uint8Array) => Promise<unknown>
}

export interface OptAdapter {
  type: string
  arch?: Arch
  hash?: string
  preSign?: (sigReq: TxParams) => Promise<string>
  postSign?: (sig: Uint8Array) => Promise<unknown>
}