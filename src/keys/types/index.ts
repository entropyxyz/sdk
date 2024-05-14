/**
 * These are types associated with entropy accounts and keys
 * */

import { Keys } from "@polkadot/types/interfaces/types"
import { Signer } from "@polkadot/api/types"
import { EntropyAccountType } from "./constants"
import { Mnemonic } from "./json"
export type RegisteredAccountType = 'Private' | 'Public'

export interface AccountsEmitter extends EventEmitter {
  type: EntropyAccountType
}
