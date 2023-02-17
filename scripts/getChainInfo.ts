// Import the API
import { ApiPromise, WsProvider } from '@polkadot/api'

async function main() {
  console.log('Connecting to node...')
  // Create connection to websocket
  const wsProvider = new WsProvider('ws://127.0.0.1:9944')
  // Create a new instance of the api
  const api = await ApiPromise.create({ provider: wsProvider })
  // get the chain information
  const chainInfo = await api.registry.getChainProperties()
  console.info('Chain info:', chainInfo)
}

main()
  .catch(console.error)
  .finally(() => {
    console.info('Done')
    process.exit()
  })
