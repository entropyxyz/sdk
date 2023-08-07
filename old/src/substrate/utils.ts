import { ApiPromise, WsProvider } from '@polkadot/api'
import { sr25519PairFromSeed, cryptoWaitReady } from '@polkadot/util-crypto'


/**
 * @alpha
 *
 * @remarks
 * This function is part of interacting with substrate
 *
 * @param {string} [endpoint='ws://127.0.0.1:9944'] websocket address of the chain
 * @returns {*}  {Promise<ApiPromise>} Promise for interfacing with entropy chain
 */

export  const getApi:(endpoint?: string) => Promise<ApiPromise>  = constructGetApiFuntion()

/**
 * @alpha
 *
 * @remarks
 * This function creates stores for apis so their are singletons of the api per endpoint
 * as a percaution if the wsprovider opens a websocket connection per instance
 * @param {string} [endpoint='ws://127.0.0.1:9944'] websocket address of the chain
 * @returns {*}  {Promise<ApiPromise>} Promise for interfacing with entropy chain
 */

export async function constructApiGetterFuntion (): (endpoint?: string) => Promise<ApiPromise> {
  const apis: {[key:string]: Promise<ApiPromise> } = {}
  return async (
    endpoint: string = 'ws://127.0.0.1:9944'
  ): Promise<ApiPromise> => {
    if (apis[endpoint]) {
      await apis[endpoint].isReady
      return apis[endpoint]
    }
    const wsProvider = new WsProvider(endpoint)
    const api = new ApiPromise({ provider: wsProvider })
    apis[endpoint] = api
    await api.isReady
    return api
  }
}

/**
 * @alpha
 *
 * @remarks
 * This function is part of the {@link Substrate} class
 *
 * @param {string} seed - the private key of the wallet
 * @returns {*}  {@link Signer} - a signer object for the user talking to the Entropy blockchain
 */
export const getWallet = async (seed: string): Promise<Signer> => {
  const keyring = new Keyring({ type: 'sr25519' })
  await cryptoWaitReady()
  const pair = sr25519PairFromSeed(seed)
  const wallet = keyring.addFromPair(pair)
  return { wallet, pair }
}
