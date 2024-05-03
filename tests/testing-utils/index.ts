import { charlieStashSeed } from './constants'
import { getWallet } from '../../src/keys'
import { execFileSync } from 'child_process'
import Entropy, { EntropyAccount } from '../../src'
import { ApiPromise } from '@polkadot/api'

export * from './constants'

export async function spinNetworkUp(networkType = 'two-nodes') {
  try {
    execFileSync(
      'dev/bin/spin-up.sh',
      [networkType],
      { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
    )
  } catch (e) {
    console.error('Error in beforeAll: ', e.message)
  }
}

export async function createTestAccount(
  entropy: Entropy,
  seed = charlieStashSeed
) {
  const signer = await getWallet(seed)

  const entropyAccount: EntropyAccount = {
    sigRequestKey: signer,
    programModKey: signer,
    programDeployKey: signer,
  }

  await sleep(30000)
  entropy = new Entropy({ account: entropyAccount })
  await entropy.ready
  return entropy
}

export async function spinNetworkDown(networkType = 'two-nodes', entropy) {
  try {
    await disconnect(entropy.substrate)
    execFileSync('dev/bin/spin-down.sh', [networkType], {
      shell: true,
      cwd: process.cwd(),
      stdio: 'inherit',
    })
  } catch (e) {
    console.error('Error in afterAll: ', e.message)
  }
}

export function sleep(durationInMs: number) {
  return new Promise((resolve) => setTimeout(resolve, durationInMs))
}

export async function disconnect(api: ApiPromise) {
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
