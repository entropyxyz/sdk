/**
 * These are types associated with entropy accounts and keys
 * */

import { EventEmitter } from 'node:events'
import { EntropyAccountType, ChildKey } from './constants'
import { EntropyAccount, PairMaterial } from './json'
import { Signer } from './internal'

export * from './constants'

export type RegisteredAccountType = 'Private' | 'Public'

export interface AccountsEmitter extends EventEmitter {
  type: EntropyAccountType
  masterAccountView: EntropyAccount
  [ChildKey.registration]: AccountWithSigner
  [ChildKey.programDev]: AccountWithSigner
  [ChildKey.deviceKey]: AccountWithSigner
  [key: string]: AccountWithSigner | unknown
}

export type AccountWithSigner = Signer & PairMaterial
