import { Keypair } from "@polkadot/util-crypto/types";
import { KeyringPair } from "@polkadot/keyring/types";
import type { AccountId32 } from '@polkadot/types/interfaces/runtime';

export interface Signer {
	wallet: KeyringPair
	pair: Keypair
} 

export interface EventFilter {
	section: string;
	name: string;
  }

export type StashKeys = Array<Address>

export type ThresholdInfo = Array<Array<Address>>

export type Address = AccountId32 | string | Uint8Array
