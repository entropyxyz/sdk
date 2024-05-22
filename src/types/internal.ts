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

/**
 * Associates an architecture with a transaction request.
 */

export enum Arch {
  /**
   * Represents the Ethereum Virtual Machine (EVM) architecture.
   */
  Evm = 'evm',

  /**
   * Represents the Bitcoin (BTC) architecture (not supported yet).
   */
  Btc = 'btc',
}

/**
 * Represents an encrypted message for transaction requests.
 */
export interface EncMsg {
  msg: string
  url: string
  tss_account: string
  // signature_verifying_key: number[]
}
