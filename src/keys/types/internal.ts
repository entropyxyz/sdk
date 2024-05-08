export interface EntropyWallet {
  sigRequestKey?: Signer
  registeringKey?: Signer | string
  programDeployKey?: Signer
  deviceKey?: Signer
  verifyingKey?: string[]
  type: EntropyAccountType
}