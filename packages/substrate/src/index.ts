import { ApiPromise, WsProvider } from "../../substrate/src";

export * from "@polkadot/api";

export class Substrate {
  api: ApiPromise;

  constructor(api: ApiPromise) {
    this.api = api;
  }

  static async getApi(endpoint?: string): Promise<Substrate> {
    const wsProvider = endpoint
      ? new WsProvider(endpoint)
      : new WsProvider("ws://127.0.0.1:9944");
    const api = new ApiPromise({ provider: wsProvider });
    await api.isReady;
    return new Substrate(api);
  }
}
