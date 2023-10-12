import { Arch } from '../../types'
export interface Adapter {
  type: string
  arch: Arch
  preSign: (sigReq: any) => Promise<string>
  postSign: (sig: any) => Promise<string>
}

export interface OptAdapter {
  type: string
  arch?: Arch
  preSign?: (sigReq: any) => Promise<string>
  postSign?: (sig: any) => Promise<string>
}
