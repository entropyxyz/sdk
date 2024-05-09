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

export default class BasePair {
  // Not sure what the interface/type should be here, leaving as any for now
  crypto: any;
  constructor ({seed, path}: {seed?: string, path?: string}) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
  }
}
