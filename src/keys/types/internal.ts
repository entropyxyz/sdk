/**
* Defines types and interfaces for managing accounts, keys, and signers in the context of the Polkadot blockchain ecosystem. It provides a unified way to handle different types of keys and signers used in various operations, such as signing requests, registering accounts, deploying programs, and verifying keys.
*
* The main interfaces and types are:
*
* - PolkadotSigner: A union type that represents a Polkadot signer, which can be either a Keypair or a RawPolkadotSigner.
* - PolkadotKeys: An alias for the Keys interface from the @polkadot/types/interfaces/types module.
* - EntropyWallet: An interface that defines the structure of an Entropy wallet, containing properties for different types of keys and signers.
* - Signer: An interface that represents a signer, with properties for the address and the underlying Polkadot signer (PolkadotSigner).
* - InternalAccounts: An interface that extends EventEmitter and defines the structure of internal accounts, with properties for different types of account-specific signers (registration, program deployment, and device key).
*/

import EventEmitter from 'node:events'
import { Keypair } from '@polkadot/util-crypto/types'
import { Keys } from '@polkadot/types/interfaces/types'
import { Signer as RawPolkadotSigner } from '@polkadot/api/types'
import { ChildKey, EntropyAccountType } from './constants'

export type PolkadotSigner = Keypair | RawPolkadotSigner
export type PolkadotKeys = Keys

/**
* Keep this in mind when dealing with Polkadot:
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
