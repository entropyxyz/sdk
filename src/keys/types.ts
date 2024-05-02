/**
 * These are types associated with entropy accounts and keys
 * */

/**
 * All base keys types is a symbolic type to show
 * what can be in a Key object all hard types are dervied
 * from this. A hard type is a required key in order to
 * generate the right accounts and signers
 * Hard key types can still have the other key but must have that specific
 * either paring of keys or single key
 *
 * */

import { Keys } from "@polkadot/types/interfaces/types"
import { Signer } from "@polkadot/api/types"
export type RegisteredAccountType = 'Private' | 'Public'

export interface AllBaseKeys {
  keyShare?: string | ArrayBuffer
  // this is the key you use for registration
  registeringKey?: string
  // this is a dev key used for deploying programs
  programDeployKey?: string
  // this is the key used for signing
  deviceKey?: string
  // this is the seed material used to generate all necessary keys
  seed?: string
}

export interface GenerateAllKeysNeededFromSeed extends Keys {
 seed: string
}

export interface ProgramDevKeys extends Keys {
  programDeployKey: string
}

export interface RootKey extends Keys {
  registeringKey: string
}
// maybe save this interface for @entropyxyz/auth
export interface AuthorizedDeviceKey extends Keys {
  deviceKey: string
}
/**
 * This describes the kinds of account that can be passed
 * to the entropy sdk class
 * PROGRAM_DEV_ACCOUNT:
 * describes a kind of user that deploys programs and has either only the seed
 * or the deploy key
 * this way we know we can lazily load registration records
 * REGISTERING_ACCOUNT:
 * Describes an account type that has a "root key" this means
 * it registerd the program set and possibly has full controll to change
 * the programs it may still be able to request signatures so dont lazy load signing
 * CONSUMER_ACCOOUNT:
 * rpersents an account type that most likley does not have access to modifiy programs
 * it may be able to and long term lazly load programs but not now
 * the device key should be passed to signing and used as the "signatureRequestAccount"
 * it should also be used to encrypt the message
 *
 *
 * */
export const enum EntropyAccountType {
  PROGRAM_DEV_ACCOUNT = 'PROGRAM_DEV_ACCOUNT',
  REGISTERING_ACCOUNT = 'REGISTERING_ACCOUNT',
  CONSUMER_ACCOUNT = 'CONSUMER_ACCOUNT',
}


// given the account type generate the appropriate keys from seed
export interface EntropyAccount {
  registeringKey?: string
  programDeployKey?: string
  deviceKey?: string
  seed?: string
  verifyingKeys?: string[]
}


export interface EntropyWallet {
  sigRequestKey?: Signer
  registeringKey?: Signer | string
  programDeployKey?: Signer
  deviceKey?: Signer
  verifyingKey?: string[]
  type: EntropyAccountType
}