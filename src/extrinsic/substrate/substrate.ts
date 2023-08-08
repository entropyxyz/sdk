import { Signer } from "../../types/substrate"
import { SubstrateRead } from "./substrateRead"
import { ApiPromise } from "@polkadot/api"
import { getApi } from "../../fetch/getApi"
import { getWallet } from "../../fetch/getWallet"

/**
 * @alpha
 * @remarks
 * This is the {@link Substrate} class
 * A class for interfacing with the Entropy blockchain, includes read and write functions
 */
export class Substrate extends SubstrateRead {
    signer: Signer
  
    /**
     * @alpha
     * @remarks
     * This function is part of the {@link Substrate} class
     * Creates an instance of Substrate.
     *
     * @param {ApiPromise} api - The api object for an Entropy blockchain
     * @param {Signer} signer - The signer object for the user interfacing with the Entropy blockchain
     */
    constructor(api: ApiPromise, signer: Signer) {
      super(api)
      this.signer = signer
    }
  
    /**
     * @alpha
     * @remarks
     * This function is part of the {@link Substrate} class
     * Static function to setup a Substrate instance
     *
     * @static
     * @param {string} seed - Private key for wallet
     * @param {string} [endpoint] - endpoint websocket address, optional will default to localhost:9944
     * @returns {*}  {Promise<Substrate>} - A promise that resolves to a Substrate object
     */
    static async setup(seed: string, endpoint?: string): Promise<Substrate> {
      const api = await getApi(endpoint)
      const wallet = await getWallet(seed)
      return new Substrate(api, wallet)
    }
}
