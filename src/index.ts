import { ApiPromise, WsProvider } from '@polkadot/api'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet } from './keys'
import { Substrate } from './substrate';

export interface EntropyOpts {
  seed?: string;
  endpoint?: string;
}

/*

The entropy class composes the functionality of
Keys
Registration
Programs
Signing

*/

export default class Entropy {
  #ready?: () => any;
  #fail?: () => any;

  substrate: Substrate
  keys?: any // momentary fix with '?'

  constructor (opts: EntropyOpts) {
    // if no seed generate seed for user and maybe do that in the key file?
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })
    this.keys = getWallet(opts.seed)

    const wsProvider = new WsProvider(endpoint)
    const substrate = await ApiPromise({ provider: wsProvider })
    substrate.isReady.then(() => {
      this.#ready()
    }).catch((error) => {
      this.#fail(error)
    })

    this.substrate = substrate

    this.registrationManager = new RegistrationManager({
      substrate,
      signer: this.keys,
    })
  }

  async register (params: RegistrationParams) {
    await this.ready
    return this.registrationManager.register(params)
  }

}


// import { ApiPromise, WsProvider } from '@polkadot/api'
// import RegistrationManager, { RegistrationParams } from './registration'
// import { getWallet } from './keys'
// import { Substrate } from './substrate';

// export interface EntropyOpts {
//   seed?: string;
//   endpoint?: string;
// }

// export default class Entropy {
//   private _ready: Promise<void>;
//   private _resolveReady!: () => void;
//   private _rejectReady!: (error: any) => void;

//   substrate: Substrate
//   keys: Promise<any>;  // assuming it returns an object; specify the type if you have it
//   registrationManager: RegistrationManager;

//   constructor (opts: EntropyOpts) {
//     this._ready = new Promise<void>((resolve, reject) => {
//       this._resolveReady = resolve;
//       this._rejectReady = reject;
//     });

//     // Setting keys as a Promise.
//     this.keys = getWallet(opts.seed);

//     const wsProvider = new WsProvider(opts.endpoint);
//     const substrate = new ApiPromise({ provider: wsProvider });
//     substrate.isReady.then(() => {
//       this._resolveReady();
//     }).catch((error) => {
//       this._rejectReady(error);
//     });

//     this.substrate = substrate;

//     this.keys.then(signer => {
//       this.registrationManager = new RegistrationManager({
//         substrate,
//         signer
//       });
//     });
//   }

//   async register (params: RegistrationParams) {
//     await this._ready;
//     return this.registrationManager.register(params);
//   }
// }
