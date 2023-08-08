import { ApiPromise, WsProvider } from '@polkadot/api'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet } from './keys'

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

  constructor (opts: EntropyOpts) {
    // if no seed generate seed for user and maybe do that in the key file?
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })
    this.keys = getWallet(opts.seed)

    const wsProvider = new WsProvider(endpoint)
    const substrate = new ApiPromise({ provider: wsProvider })
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