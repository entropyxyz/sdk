/**
 * These are types associated with entropy accounts and keys
 * */

import EventEmitter from 'node:events'
import { EntropyAccountType } from "./constants"
export type RegisteredAccountType = 'Private' | 'Public'

export interface AccountsEmitter extends EventEmitter {
  type: EntropyAccountType
}
