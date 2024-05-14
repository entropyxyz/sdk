/**
 * These are internal facing types
 * */
import Entropy from './../index'
import type { AccountId32 } from '@polkadot/types/interfaces/runtime'

export type EntropyInstance = InstanceType<typeof Entropy>
export interface ValidatorInfo {
  x25519_public_key: string
  ip_address: string
  tss_account: string
}

export type Address = AccountId32 | string | Uint8Array

export interface EventFilter {
  section: string
  name: string
}

// This associates an architecture with a transaction request
export enum Arch {
  Evm = 'evm',
  // not supported yet
  Btc = 'btc',
}

export interface EncMsg {
  msg: string
  url: string
  tss_account: string
  signature_verifying_key: string
}
