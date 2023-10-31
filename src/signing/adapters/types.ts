import { Arch } from '../../types'
import { TxParams } from '..'
import { SignatureLike } from '@ethersproject/bytes'
export interface Adapter {
  type: string
  arch: Arch
  preSign: (sigReq: TxParams) => Promise<string>
  postSign: (sig: Uint8Array) => Promise<unknown>
}

export interface OptAdapter {
  type: string
  arch?: Arch
  preSign?: (sigReq: TxParams) => Promise<string>
  postSign?: (sig: Uint8Array) => Promise<unknown>
}
