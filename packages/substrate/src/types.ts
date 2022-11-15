import { AddressOrPair } from "@polkadot/api/types";
import { Keypair } from "@polkadot/util-crypto/types";

export interface Signer {
	wallet: AddressOrPair
	pair: Keypair
} 