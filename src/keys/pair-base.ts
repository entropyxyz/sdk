/**
 * A utility class to allow consumers of the sdk to subscribe to key creations and "account" updates.
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


/**
 * A proxy object that wraps the crypto functions from the @polkadot/util-crypto library. It ensures that the crypto functions are only accessed after the cryptoWaitReady promise is resolved.
 *
 * @private
 * @type {Proxy<Object>}
 */
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


/**
 * Creates a new instance of the BasePair class.
 *
 * @param {Object} options - The options for creating the instance.
 * @param {string} [options.seed] - The seed for the key pair (optional).
 * @param {string} [options.path] - The derivation path for the key pair (optional).
 */
export default class BasePair {
  // Not sure what the interface/type should be here, leaving as any for now
  crypto: any;
  constructor ({seed, path}: {seed?: string, path?: string}) {
    // these are async wrapped functions of polkadot crypto
    this.crypto = crypto
  }
}
