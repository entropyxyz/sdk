import { ApiPromise /* WsProvider */ } from '@polkadot/api'
import { execFileSync } from 'child_process'

export async function spinNetworkUp(networkType = 'two-nodes') {
  try {
    execFileSync(
      'dev/bin/spin-up.sh',
      [networkType],
      { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
    )
  } catch (e) {
    console.error('Error in spinNetworkUp: ', e.message)
  }
}

export async function spinNetworkDown(networkType = 'two-nodes') {
  try {
    execFileSync('dev/bin/spin-down.sh', [networkType], {
      shell: true,
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  } catch (e) {
    console.error('Error in afterAll: ', e.message)
  }
}

// export async function getApi(endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> {
//   const wsProvider = new WsProvider(endpoint)
//   const api = new ApiPromise({ provider: wsProvider })
//   await api.isReady
//   return api
// }
