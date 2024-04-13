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
export type RegisteredAccountType = 'Private' | 'Public'

export interface AllBaseKeys {
  keyShare?: string | ArrayBuffer?
  programModKey?: string
  programDeployKey?: string
  deviceKey?: string
  seed?: string
}

export interface GenerateAllKeysNeededFromSeed extends Keys {
 seed: string
}

export interface ProgramDevKeys extends Keys {
  programDeployKey: string
}

export interface RootKey extends Keys {
  programModKey: string
}
// maybe save this interface for @entropyxyz/auth
export interface AuthorizedDeviceKey extends Keys {
  deviceKey: string
}

export const enum EntropyAccountType {
  PROGRAM_DEV_ACCOUNT = 'PROGRAM_DEV_ACCOUNT'
  REGISTERED_ACCOUNT = 'REGISTERED_ACCOUNT'
  CONSUMER_ACCOOUNT = 'CONSUMER_ACCOOUNT'
}

export interface EntropyAccountJSON {
  keyShare?: string | ArrayBuffer?
  registeringKey?: string
  programDeployKey?: string
  deviceKey?: string
  seed?: string
  verifyingKeys?: string[]
  type: EntropyAccountType
}


export interface EntropyAccount {
  sigRequestKey?: Signer
  programModKey?: Signer | string
  programDeployKey?: Signer
  deviceKey?: Signer
  verifyingKey?: string
  type: "Public" | "Private" | null
}