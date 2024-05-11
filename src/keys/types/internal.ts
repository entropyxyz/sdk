import EventEmitter from 'node:events'
import { Keypair } from '@polkadot/util-crypto/types'
import { Keys } from '@polkadot/types/interfaces/types'
import { Signer as RawPolkadotSigner } from '@polkadot/api/types'
import { KeyringPair } from '@polkadot/keyring/types'

import { ChildKey, EntropyAccountType } from './constants'

export type PolkadotSigner = KeyringPair
export type PolkadotKeys = Keys

/**
 * keep this in mind when dealing with polkadot:
 * Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
 * Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
 * Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
*/

export interface Pair extends PolkadotSigner {
  secretKey: Uint8Array
}

export interface Signer {
  address: string
  pair: PolkadotSigner
  verifyingKeys: string[]
}


export interface InternalAccounts extends EventEmitter {
  [ChildKey.REGISTRATION]: Signer
  [ChildKey.PROGRAM_DEV]: Signer
  [ChildKey.DEVICE_KEY]: Signer
}