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

export type UIDv4 = string

/**
 * hex strings
 * */

export type hexString = string
export type SS558Encoding = string
export type SS58Address = notHexPrefixString
export type seed = hexString
export type publicKey = hexString
export type verifiyingKey = publicKey

/**
 * see {@link https://polkadot.js.org/docs/keyring/start/suri/|polkadot js} for dervation paths
 * */
export type DerivationPath = string

/**
 * 12 or 24? words separated by spaces defined by bip39
 * */
export type Menomnic = string

export type KeyMaterial = HexSeedMaterial | MenomnicSeedMaterial

export interface HexSeedMaterial {
  seed: seed
  // one day this would be nice to have
  // path?: Path
}

export interface MenomnicSeedMaterial {
  menomnic: Menomnic
  // one day this would be nice to have
  // path?: Path
}

export interface EntropyAccount {
  // rename these to match child key
  registeringKey?: PairMaterial
  programDeployKey?: PairMaterial
  deviceKey?: PairMaterial
  // end rename
  mnemonic?: Menomnic
  seed?:
  verifyingKeys?: string[]
}

export interface PairMaterial {
  // 32
  address?: SS58Address
  //
  path: DerivationPath

  seed?: seed

  type: ChildKey
  // is list of address? i think these are acctually publicKeys
  verifyingKeys?: verfiyingKey[]
}
