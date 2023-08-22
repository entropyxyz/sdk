import { ApiPromise, WsProvider } from '@polkadot/api'
import { SignatureLike } from '@ethersproject/bytes'
import RegistrationManager, { RegistrationParams } from './registration'
import { getWallet } from './keys'
import SignatureRequestManager, { SigOps, SigTxOps }  from './signing'
import {  crypto } from './utils/crypto' 
import { Adapter } from './signing/adapters/types'
import { Signer } from './types'

export interface EntropyOpts {
  seed?: string;
  endpoint?: string;
  adapters?: { [key: string | number]: Adapter };
}

export default class Entropy {
  #ready?: (value?: any) => void
  #fail?: (reason?: any) => void
  ready: Promise<void>

  keys?: Signer
  registrationManager: RegistrationManager

  substrate: ApiPromise

  async init (opts: EntropyOpts) {
    this.keys = await getWallet(opts.seed);
    const wsProvider = new WsProvider(opts.endpoint);
  
    const substrate = new ApiPromise({ provider: wsProvider });
  
    this.registrationManager = new RegistrationManager({
      substrate: substrate,
      signer: this.keys,
    });
    this.signingManager = new SignatureRequestManager({
      signer: this.keys,
      substrate,
      adapters,
      crypto
    });
    await substrate.isReady;
    this.#ready();
  }

  constructor(opts: EntropyOpts) {
    this.ready = new Promise((resolve, reject) => {
      this.#ready = resolve
      this.#fail = reject
    })
  
    this.init(opts).catch((error) => {
      this.#fail(error);
    })
  }

  async register (params: RegistrationParams) {
    await this.ready
    return this.registrationManager.register(params)
  }

  async signTransaction (params: SigTxOps): Promise<SignatureLike> {
    await this.ready
    return this.signingManager.signTransaction(params)
  }

  async sign (params: SigOps): Promise<SignatureLike> {
    await this.ready
    return this.signingManager.sign(params)
  }

}

