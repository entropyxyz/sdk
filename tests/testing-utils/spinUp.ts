import { ApiPromise, WsProvider } from '@polkadot/api'

async function getApi(endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> {
  const wsProvider = new WsProvider(endpoint)
  const api = new ApiPromise({ provider: wsProvider })
  await api.isReady
  return api
}

