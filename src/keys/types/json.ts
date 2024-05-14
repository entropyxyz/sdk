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

import { ChildKey } from "./constants"

export type UIDv4 = string

/**
 * hex strings
 * */

export type HexString = string
export type SS558Encoding = string
// address without 0x prefix
export type SS58Address = string
export type Seed = HexString
export type PublicKey = HexString
export type VerifiyingKey = PublicKey

/**
 * see {@link https://polkadot.js.org/docs/keyring/start/suri/|polkadot js} for dervation paths
 * */
export type DerivationPath = string

/**
 * 12 or 24? words separated by spaces defined by bip39
 * */

export type Mnemonic = string

export type KeyMaterial = HexSeedMaterial | MnemonicSeedMaterial

export interface HexSeedMaterial {
  seed: Seed
  // one day this would be nice to have
  // path?: Path
}

export interface MnemonicSeedMaterial {
  menomnic: Mnemonic
  // one day this would be nice to have
  // path?: Path
}

export interface EntropyAccount {
  // rename these to match child key
  registeringKey?: PairMaterial
  programDeployKey?: PairMaterial
  deviceKey?: PairMaterial
  // end rename
  mnemonic?: Mnemonic
  seed?: Seed
  verifyingKeys?: string[]
}

export interface PairMaterial {
  // 32
  address?: SS58Address
  //
  path: DerivationPath

  seed?: Seed

  type: ChildKey
  // is list of address? i think these are acctually publicKeys
  verifyingKeys?: VerifiyingKey[]
}
