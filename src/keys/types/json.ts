/**
 *
 *
 * ANYTHING IN THIS FILE CAN BE PASSED
 * TO JSON.stringify(any) AND NOT ERROR
 * Uint8Arrays DO NOT BELONG IN THIS FILE!
 * Love you
 *
 *
 *
 * */

import {
  ChildKey,
  EntropyAccountType,
  EntropyAccountContextType,
} from './constants.js'

export type UIDv4 = string

/**
 * Represents a hexadecimal string.
 */

export type HexString = string

/**
 * Represents an SS58 encoded string.
 */

export type SS558Encoding = string

/**
 * Represents an SS58 address without the '0x' prefix.
 */

export type SS58Address = string

/**
 * Represents a seed in hexadecimal format.
 */

export type Seed = HexString

/**
 * Represents a public key in hexadecimal format.
 */

export type PublicKey = HexString

/**
 * Represents a verifying key, which is a type of public key.
 */

export type VerifyingKey = PublicKey

/**
 * Represents a derivation path used in key generation.
 * See {@link https://polkadot.js.org/docs/keyring/start/suri/|polkadot js} for more details.
 */

export type DerivationPath = string

/**
 * Represents a mnemonic phrase consisting of 12 or 24 words, separated by spaces, defined by BIP39.
 */

export type Mnemonic = string

/**
 * Represents the key material, which can be either a hexadecimal seed or a mnemonic seed.
 */

export type KeyMaterial =
  | (HexSeedMaterial & MnemonicSeedMaterial)
  | EntropyAccount // HexSeedMaterial & MnemonicSeedMaterial

/**
 * Represents key material using a hexadecimal seed.
 */
export interface HexSeedMaterial {
  seed?: Seed
  // one day this would be nice to have
  // path?: Path
}

/**
 * Represents key material using a mnemonic seed.
 */
export interface MnemonicSeedMaterial {
  mnemonic?: Mnemonic
  // one day this would be nice to have
  // path?: Path
}

/**
 * Represents an entropy account with optional key materials and verifying keys.
 */
export interface EntropyAccount {
  // rename these to match child key
  [ChildKey.registration]?: PairMaterial
  [ChildKey.programDev]?: PairMaterial
  [ChildKey.deviceKey]?: PairMaterial
  // end rename
  mnemonic?: Mnemonic
  seed?: Seed
  verifyingKeys?: string[]
  type?: EntropyAccountType
  debug?: boolean
  admin?: PairMaterial
  [key: string]: PairMaterial | any
}

/**
 * Represents the material for a key pair, including address, path, seed, type, and verifying keys.
 */
export interface PairMaterial {
  // 32 bytes Optional SS58 address for the key pair.
  address?: SS58Address
  // Derivation path used for generating the key pair.
  path?: DerivationPath
  // Optional seed for the key pair.
  seed?: Seed
  // List of verifying keys associated with the key pair.
  verifyingKeys?: VerifyingKey[]
  // Type of the key, corresponding to a child key.
  type: EntropyAccountContextType
  // a key type concept
  userContext?: EntropyAccountContextType
}
