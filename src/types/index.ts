import { Keypair } from '@polkadot/util-crypto/types'
import { KeyringPair } from '@polkadot/keyring/types'
import type { AccountId32 } from '@polkadot/types/interfaces/runtime'
import {U8aFixed} from '@polkadot/types-codec'

export type base64string = string
export type hexString = string

export interface KeyPair {
  public: base64string
  private: hexString
}

export interface Signer {
  wallet: KeyringPair
  pair: Keypair
}

export interface ServerDHInfo {
  x25519_public_key: Uint8Array | string | U8aFixed
}

export interface KeyShare {
  keyShare: Uint8Array
}

export interface Account extends KeyShare {
  sigRrequestKeyPair
}

export type keyShare = Uint8Array

/// Information about a threshold server
export interface ServerInfo extends ServerDHInfo{
  tss_account: Uint8Array
  endpoint: string
}
/*
/// Represents an unparsed, transaction request coming from the client.
#[cfg_attr(feature = "std", derive(Serialize, Deserialize))]
#[derive(Debug, Clone, PartialEq)]
pub struct UserTransactionRequest {
    /// 'eth', etc.
    pub arch: String,
    /// ETH: RLP encoded transaction request
    pub transaction_request: String,
    /// Information from the validators in signing party
    pub validators_info: Vec<ValidatorInfo>,
}
*/
export interface UserTransactionRequest {
    /// 'eth', etc.
    arch: Arch
    /// ETH: RLP encoded transaction request
    transaction_request: string
    validators_info: ValidatorInfo
}

/*
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
export type StashKeys = Array<Address>
export type ThresholdInfo = Array<Array<Address>>

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

// ITransactionRequest is what the `/user/tx` endpoint expects to receive
export interface ITransactionRequest {
  arch: Arch
  transaction_request: string
}

export interface EncMsg {
  encMsg: string
  url: string
}

/*

return type for isRegistering
{
        is_registering: bool,
        constraint_account: string,
        is_swapping: bool,
        pub confirmations: []strings,
        pub constraints?: any,
    }
    */