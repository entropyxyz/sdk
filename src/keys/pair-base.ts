/**
 * A utility class to allow consumers of the sdk to subscribe
 * to key creations and "account" updates
 */

import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress,
} from '@polkadot/util-crypto'

const ready = cryptoWaitReady()

const crypto = new Proxy({
  sr25519PairFromSeed,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress
}, {
  get: async (base, key) => {
    await ready
    return base[key]
  }
})



export type KeyMaterial = HexSeedMaterial | MenomnicSeedMaterial

/**
 * hex strings
 * */

export type seed = string
export type path = string

/**
 * 12 or 24? words separated by spaces defined by bip39
 * */
export type menomnic = string

export interface HexSeedMaterial {
  seed: seed
  path?: path
}

export interface MenomnicSeedMaterial {
  menomnic: menomnic
  path?: path
}

export default class BasePair {
  async constructor ({seed, path}: {seed?: string, path?: string}) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
  }
}
