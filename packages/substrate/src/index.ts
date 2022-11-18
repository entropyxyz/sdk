import { AddressOrPair, SubmittableExtrinsic } from "@polkadot/api/types";
import { AnyJson } from "@polkadot/types-codec/types";
import { Keyring } from "@polkadot/keyring";
import { sr25519PairFromSeed } from "@polkadot/util-crypto";
import { Signer, StashKeys, ThresholdInfo, EventFilter, Address } from "./types";
import { SubmittableResult, ApiPromise, WsProvider } from "@polkadot/api";
export * as polkadotJs from "@polkadot/api";
import { EventRecord } from "@polkadot/types/interfaces/types";

export class SubstrateRead {
  api: ApiPromise;

  /**
   * Constructs a new object for read only calls to Entropy chain
   * does not require a user wallet
   * @param api the api object for an Entropy chain
   */
  constructor(api: ApiPromise) {
    this.api = api;
  }

  /**
   * Static function to setup a Substrate Read object
   * @param endpoint endpoint ws address, optional will default to localhost
   * @returns Self
   */
  static async setup(endpoint?: string): Promise<SubstrateRead> {
    const api = await getApi(endpoint);
    return new SubstrateRead(api);
  }
  /**
   *
   * @param stashKeys An array of stash keys to query
   * @returns threshold server keys associated with the server
   */
  async getThresholdInfo(stashKeys: StashKeys): Promise<ThresholdInfo> {
    let result: ThresholdInfo = [];
    for (let i = 0; i < stashKeys.length; i++) {
      // TODO needs to be changed after next update
      let r = await this.api.query.stakingExtension.thresholdAccounts(
        stashKeys[i]
      );
      const convertedResult: any = r.toHuman() ? r.toHuman() : null;
      convertedResult ? result.push(convertedResult) : null;
    }
    return result;
  }

  async isRegistering(address: Address): Promise<AnyJson> {
    const result = await this.api.query.relayer.registering(address);
    return result.toHuman();
  }
}

export class Substrate extends SubstrateRead {
  api: ApiPromise;
  signer: Signer;

  /**
   * Constructs a new object to talk to Entropy chain
   * @param api an api object for Entropy chain
   * @param signer a signer object for the user talking to the Entropy chain
   */
  constructor(api: ApiPromise, signer: Signer) {
    super(api);
    this.api = api;
    this.signer = signer;
  }

  /**
   * Static function to setup a Substrate instance
   * @param seed Private key for wallet
   * @param endpoint endpoint ws address, optional will default to localhost
   * @returns Self
   */
  static async setup(seed: string, endpoint?: string): Promise<Substrate> {
    const api = await getApi(endpoint);
    const wallet = await getWallet(seed);
    return new Substrate(api, wallet);
  }

  /**
   * Signs and sends the given `call` from `sender` and waits for the transaction to be included in a block.
   * @param api api object
   * @param call a call that can be submitted to the chain
   * @param sender the sender of the transaction
   */
  async sendAndWait(
    call: SubmittableExtrinsic<"promise">,
    api: ApiPromise,
    sender: AddressOrPair
  ): Promise<undefined> {
    return new Promise<undefined>((resolve, reject) => {
      call
        .signAndSend(sender, (res: SubmittableResult) => {
          const { dispatchError, status } = res;

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = api.registry.findMetaError(
                dispatchError.asModule
              );
              const { documentation, name, section } = decoded;

              const err = Error(
                `${section}.${name}: ${documentation.join(" ")}`
              );

              err.name = name;
              reject(err);
            } else {
              reject(Error(dispatchError.toString()));
            }
          }

          if (status.isInBlock || status.isFinalized) {
            resolve(undefined);
          }
        })
        .catch((e) => {
          reject(Error(e.message));
        });
    });
  }

  /**
   * Signs and sends the given `call` from `sender` and waits for an event that fits `filter`.
   * @param api api object
   * @param call a call that can be submitted to the chain
   * @param sender the sender of the transaction
   * @param filter which event to filter for
   * @returns event that fits the filter
   */
  async sendAndWaitFor(
    api: ApiPromise,
    call: SubmittableExtrinsic<"promise">,
    sender: AddressOrPair,
    filter: EventFilter
  ): Promise<EventRecord> {
    return new Promise<EventRecord>((resolve, reject) => {
      call
        .signAndSend(sender, (res: SubmittableResult) => {
          const { dispatchError, status } = res;

          if (dispatchError) {
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded: any = api.registry.findMetaError(
                dispatchError.asModule
              );
              const { documentation, name, section } = decoded;

              reject(Error(`${section}.${name}: ${documentation.join(" ")}`));
            } else {
              reject(Error(dispatchError.toString()));
            }
          }

          if (status.isInBlock || status.isFinalized) {
            const record = res.findRecord(filter.section, filter.name);

            if (record) {
              resolve(record);
            } else {
              reject(Error("Event record not found"));
            }
          }
        })
        .catch((e) => {
          reject(Error(e.message));
        });
    });
  }

  /**
   * registers an account then checks if it is registered
   * @returns If the account is registered
   */
  async register(): Promise<AnyJson> {
    const tx = this.api.tx.relayer.register();
    await this.sendAndWait(tx, this.api, this.signer.wallet);
    const isRegistered = await this.isRegistering(this.signer.wallet.address);
    return isRegistered;
  }
}

/**
 *
 * @param endpoint a string of the ws address of the chain
 * @returns an api object for talking to entropy chain
 */
const getApi = async (endpoint?: string): Promise<ApiPromise> => {
  const wsProvider = endpoint
    ? new WsProvider(endpoint)
    : new WsProvider("ws://127.0.0.1:9944");
  const api = new ApiPromise({ provider: wsProvider });
  await api.isReady;
  return api;
};

/**
 *
 * @param seed A string of the private key of the wallet
 * @returns a wallet object and a pair object
 */
const getWallet = (seed: string): Signer => {
  const keyring = new Keyring({ type: "sr25519" });
  const pair = sr25519PairFromSeed(seed);
  const wallet = keyring.addFromPair(pair);
  return { wallet, pair };
};
