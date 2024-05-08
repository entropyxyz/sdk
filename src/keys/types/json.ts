
export type UIDv4 = string

/**
 * hex strings
 * */

export type hexString = string

export type seed = hexString
/**
 * see {@link https://polkadot.js.org/docs/keyring/start/suri/|polkadot js} for dervation paths
 * */
export type Path = string

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
  registeringKey?: PairMaterial
  programDeployKey?: PairMaterial
  deviceKey?: PairMaterial
  mnemonic?: Menomnic
  seed?:
  verifyingKeys?: string[]
}

export interface PairMaterial {
  // 32
  address?: hexString
  //
  path: Path
}
