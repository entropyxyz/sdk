import { ApiPromise, WsProvider } from '@polkadot/api'

async function getApi(endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> {
  const wsProvider = new WsProvider(endpoint)
  const api = new ApiPromise({ provider: wsProvider })
  await api.isReady
  return api
}

export const sleep = (durationInMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationInMs))
}

export const disconnect = async (api: ApiPromise) => {
  console.log('Attempting to disconnect...')
  if (api.isConnected) {
    try {
      await api.disconnect()
      console.log('Disconnected successfully.')
    } catch (error) {
      console.error(`Error while disconnecting: ${error.message}`)
    }
  } else {
    console.log('API is already disconnected.')
  }
}
