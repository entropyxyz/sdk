import { Arch } from '../../types'
import { TxParams } from '..'
import { SignatureLike } from '@ethersproject/bytes'
export interface Adapter {
  type: string
  arch: Arch
  preSign: (sigReq: TxParams) => Promise<string>
  postSign: (sig: SignatureLike) => Promise<string>
}

export interface OptAdapter {
  type: string
  arch?: Arch
  preSign?: (sigReq: TxParams) => Promise<string>
  postSign?: (sig: SignatureLike) => Promise<string>
}
