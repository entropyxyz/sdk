import EventEmitter from `node:events`
import { Keypair } from '@polkadot/util-crypto/types'
import { Keys } from '@polkadot/types/interfaces/types'
import { Signer } from '@polkadot/api/types'

import { ChildKey } from './constants'

export type PolkadotSigner = Keypair
export type PolkadotKeys = Keys
export type PolkadotSigner = Signer

/**
 * keep this in mind when dealing with polkadot:
 * Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
 * Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
 * Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
*/
export interface EntropyWallet {
  sigRequestKey?: Signer
  registeringKey?: Signer | string
  programDeployKey?: Signer
  deviceKey?: Signer
  verifyingKey?: string[]
  type: EntropyAccountType
}

export interface Signer {
  address: string
  pair: PolkadotSigner
}


export interface InternalAccounts extends EventEmitter {
  [ChildKey.REGISTRATION]: Signer
  [ChildKey.PROGRAM_DEV]: Signer
  [ChildKey.DEVICE_KEY]: Signer
}