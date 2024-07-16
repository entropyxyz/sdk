import * as EventEmitter from 'node:events'
import { Keys } from '@polkadot/types/interfaces/types'
import { KeyringPair } from '@polkadot/keyring/types'
import { ChildKey } from './constants'

/**
 * Keep this in mind when dealing with Polkadot:
 * Secret seed:       0xc8fa03532fb22ee1f7f6908b9c02b4e72483f0dbd66e4cd456b8f34c6230b849
 * Public key (hex):  0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * Public key (SS58): 5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
 * Account ID:        0xd6a3105d6768e956e9e5d41050ac29843f98561410d3a47f9dd5b3b227ab8746
 * SS58 Address:      5Gv8YYFu8H1btvmrJy9FjjAWfb99wrhV3uhPFoNEr918utyR
 */

/**
 * Represents a Polkadot signer, which is a keyring pair containing public and private keys.
 */

export type PolkadotSigner = KeyringPair

/**
 * Represents a collection of Polkadot keys.
 */

export type PolkadotKeys = Keys

/**
 * Extends the PolkadotSigner interface to include a secret key.
 */
export interface Pair extends PolkadotSigner {
  secretKey: Uint8Array
}

/**
 * Represents a signer with an address, a key pair, and a list of verifying keys.
 */
export interface Signer {
  address: string
  pair: Pair
  verifyingKeys: string[]
  used: boolean
  [key: string]: unknown
}

/**
 * Represents internal accounts managed by the SDK, each associated with a specific child key.
 * Extends EventEmitter to allow subscription to account events.
 */
export interface InternalAccounts extends EventEmitter {
  [ChildKey.registration]: Signer
  [ChildKey.programDev]: Signer
  [ChildKey.deviceKey]: Signer
}
