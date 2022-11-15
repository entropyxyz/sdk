import { AddressOrPair } from "@polkadot/api/types";
import { ApiPromise, WsProvider } from "../../substrate/src";
import { Keyring } from "@polkadot/keyring";
import { sr25519PairFromSeed } from "@polkadot/util-crypto";
import { Signer } from "./types";
export * from "@polkadot/api";

export class SubstrateRead {
  api: ApiPromise;

  constructor(api: ApiPromise) {
    this.api = api;
  }

  static async setup(endpoint?: string): Promise<SubstrateRead> {
    const api = await getApi(endpoint);
    return new SubstrateRead(api);
  }
}

export class Substrate extends SubstrateRead {
  api: ApiPromise;
  signer: Signer;

  constructor(api: ApiPromise, signer: Signer) {
    super(api);
    this.api = api;
    this.signer = signer;
  }

  static async setup(seed: string, endpoint?: string): Promise<Substrate> {
    const api = await getApi(endpoint);
    const wallet = await getWallet(seed);
    return new Substrate(api, wallet);
  }
}

const getApi = async (endpoint?: string): Promise<ApiPromise> => {
  const wsProvider = endpoint
    ? new WsProvider(endpoint)
    : new WsProvider("ws://127.0.0.1:9944");
  const api = new ApiPromise({ provider: wsProvider });
  await api.isReady;
  return api;
};

const getWallet = (seed: string): Signer => {
  const keyring = new Keyring({ type: "sr25519" });
  const pair = sr25519PairFromSeed(seed);
  const wallet = keyring.addFromPair(pair);
  return { wallet, pair };
};
