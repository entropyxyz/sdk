import EventEmitter from `node:events`
import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
} from '@polkadot/util-crypto'
import { Keyring} from '@polkadot/keyring'
import { hexToU8a } from '@polkadot/util'
import { Signer } from '../types'
import KeyringPair from '@polkadot/keyring'
import { type EntropyAccountJSON} from './types'
import { EntropyAccountType, EntropyWallet, EntropyAccount } from './types'

export function createEntropyAccount (account?: EntropyAccountInfo) : EntropyAccount {
  const keyring = {}

  // create wallet and signer for each seed and dervation path

  return new Proxy(new EventEmitter(), {
    get: (events, objKey) => {
      if (events[objKey]) return events[objKey]
      return keyring[objKey]
    }
  })
}
// Left off here you need to creat wallet and signer to give back to consuming classes
export function createWalletAndSigner () {

}