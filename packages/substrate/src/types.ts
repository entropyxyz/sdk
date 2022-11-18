import { AddressOrPair } from "@polkadot/api/types";
import { Keypair } from "@polkadot/util-crypto/types";
import { KeyringPair } from "@polkadot/keyring/types";

export interface Signer {
	wallet: KeyringPair
	pair: Keypair
} 

export interface EventFilter {
	section: string;
	name: string;
  }

export type StashKeys = Array<String>

export type ThresholdKeys = Array<String>