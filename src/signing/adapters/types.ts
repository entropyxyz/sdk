export interface Adapter {
  type: string
  arch: string
  preSign: () => Promise<string>
  postSign: () => Promise<string>
}

export interface OptAdapter {
  type: string
  arch?: string
  preSign?: () => Promise<string>
  postSign?: () => Promise<string>
}



