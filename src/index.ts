import { ApiPromise, WsProvider } from '@polkadot/api';
import RegistrationManager, { RegistrationParams } from './registration';
import { getWallet } from './keys';
import { Substrate } from './substrate';

export interface EntropyOpts {
  seed?: string;
  endpoint?: string;
}

export default class Entropy {
  #ready?: (value?: any) => void;
  #fail?: (reason?: any) => void;
  ready: Promise<void>;

  keys?: any;
  registrationManager: RegistrationManager;

  substrate: Substrate;

  constructor(opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve;
      this.#fail = reject;
    });

    this.keys = getWallet(opts.seed);
    const wsProvider = new WsProvider(opts.endpoint);

    (async () => {
      try {
        const apiInstance = await ApiPromise.create({ provider: wsProvider });
        this.substrate = new Substrate(apiInstance, this.keys);

        this.registrationManager = new RegistrationManager({
          substrate: this.substrate.apiInstance, 
          signer: this.keys,
        });

        this.#ready();
      } catch (error) {
        this.#fail(error);
      }
    })();
  }

  async register(params: RegistrationParams) {
    await this.ready;
    return this.registrationManager.register(params);
  }
}

