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
import { EntropyAccountType } from "./constants"
import { Mnemonic } from "./json"
export type RegisteredAccountType = 'Private' | 'Public'



export interface AllBaseKeys {
  keyShare?: string | ArrayBuffer
  // this is the key you use for registration
  registeringKey?: string
  // this is a dev key used for deploying programs
  programDeployKey?: string
  // this is the key used for signing
  deviceKey?: string
  // this is the mnemonic material used to generate all necessary keys
  mnemonic?: string
}

export interface GenerateAllKeysNeededFromMnemonic extends Keys {
 mnemonic: Mnemonic
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