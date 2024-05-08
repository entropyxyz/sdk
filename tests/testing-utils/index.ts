import { ApiPromise } from '@polkadot/api'
import { execFileSync } from 'child_process'
import { rimrafSync } from 'rimraf'

import Entropy, { EntropyAccount } from '../../src'
import { getWallet } from '../../src/keys'
import { charlieStashSeed } from './constants'
export * from './constants'

export type spinNetworkUpOpts = void | {
  startClean?: boolean
}

export async function spinNetworkUp(
  networkType = 'two-nodes',
  opts: spinNetworkUpOpts
) {
  const { startClean = true } = opts || {}

  try {
    if (startClean) rimrafSync('.entropy')

    execFileSync(
      'dev/bin/spin-up.sh',
      [networkType],
      { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
    )
  } catch (e) {
    console.error('Error in spintNetworkUp: ', e.message)
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

  await sleep(10_000)
  // QUESTION: (mix) why was this here?
  entropy = new Entropy({ account: entropyAccount })
  await entropy.ready
  return entropy
}

export async function spinNetworkDown(
  networkType = 'two-nodes',
  entropy: Entropy
) {
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
  console.log(`sleep (${Math.round(durationInMs / 1000)}s)`)
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
