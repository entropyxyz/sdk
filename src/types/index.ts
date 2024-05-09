import Entropy from './../index'
import { Keypair } from '@polkadot/util-crypto/types'
import { KeyringPair } from '@polkadot/keyring/types'
import type { AccountId32 } from '@polkadot/types/interfaces/runtime'
import { U8aFixed } from '@polkadot/types-codec'

export type EntropyInstance = InstanceType<typeof Entropy>

export interface Signer {
  wallet: KeyringPair
  pair: Keypair
}

/*
here is the rust representation of this type

#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ValidatorInfo {
    pub x25519_public_key: X25519PublicKey,
    pub ip_address: SocketAddrV4,
    pub tss_account: AccountId32,
}
*/
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
