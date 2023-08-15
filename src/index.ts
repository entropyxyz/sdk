import { ApiPromise, WsProvider } from '@polkadot/api'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet } from './keys'
import SignatureRequestManager from './signing'

export interface EntropyOpts {
  seed?: string;
  endpoint?: string;
  adapters?: { [key: string | number]: adapter };
}

export default class Entropy {
  #ready?: (value?: any) => void
  #fail?: (reason?: any) => void
  ready: Promise<void>

  keys?: any
  registrationManager: RegistrationManager

  substrate: ApiPromise

  constructor(opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })

    this.keys = getWallet(opts.seed)
    const wsProvider = new WsProvider(opts.endpoint)

    const substrate = new ApiPromise({ provider: wsProvider })

    this.registrationManager = new RegistrationManager({
      substrate: substrate,
      signer: this.keys,
    })
    this.signingManager = SignatureRequestManager({
      signer: this.keys,
      substrate,
      adapters,
      crypto
    })
    substrate.isReady.then(() => {
      this.#ready()
    }).catch((error) => {
      this.#fail(error)
    })
  }

  async register(params: RegistrationParams) {
    await this.ready
    return this.registrationManager.register(params)
  }
}

