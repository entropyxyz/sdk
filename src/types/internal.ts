/**
 * These are internal facing types
 * */
import Entropy from './../index'
import type { AccountId32 } from '@polkadot/types/interfaces/runtime'

/**
 * Represents an instance of the Entropy class.
 */

export type EntropyInstance = InstanceType<typeof Entropy>

/**
 * Represents information about a validator.
 */
export interface ValidatorInfo {
  x25519_public_key: string
  ip_address: string
  tss_account: string
}

/**
 * Represents an address in various formats: AccountId32, string, or Uint8Array.
 */

export type Address = AccountId32 | string | Uint8Array

/**
 * Represents a filter for events, including the section and name of the event.
 */

export interface EventFilter {
  section: string
  name: string
}
