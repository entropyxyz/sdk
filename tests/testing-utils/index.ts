import { ApiPromise } from '@polkadot/api'
import { execFileSync } from 'child_process'
import * as readline from 'readline'

import Entropy, { EntropyAccount } from '../../src'
import { getWallet } from '../../src/keys'
import { charlieStashSeed } from './constants'

export * from './constants'
export * from './readKey'
export * from './getApi'

export type spinNetworkUpOpts = void | {
  startClean?: boolean
}

/* Helper for wrapping promises which makes it super clear in logging if the promise
 * resolves or threw.
 *
 * @param {any} t - an instance to tape runner
 * @param {boolean} keepThrowing - toggle throwing
 */
export function promiseRunner(t: any, keepThrowing = true) {
  // NOTE: this function swallows errors
  return async function run(
    message: string,
    promise: Promise<any>
  ): Promise<any> {
    if (promise.constructor !== Promise) {
      t.pass(message)
      return Promise.resolve(promise)
    }

    return promise
      .then((result) => {
        t.pass(message)
        return result
      })
      .catch((err) => {
        t.error(err, message)
        if (keepThrowing) throw err
      })
  }
}

export function createTimeout(time: number, message?: string) {
  const timeout = setTimeout(() => {
    throw Error(`Timeout hit: ${message || ''}`)
  }, time)

  return {
    clear: () => clearTimeout(timeout),
  }
}

export async function spinNetworkUp(networkType = 'two-nodes') {
  try {
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

  await sleep(5_000)
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

const SLEEP_DONE = '▓'
const SLEEP_TODO = '░'

export function sleep(durationInMs: number) {
  return new Promise((resolve) => {
    let count = 0

    readline.cursorTo(process.stdout, 2)

    const steps = Math.min(Math.round(durationInMs / 1000), 80)
    const stepLength = durationInMs / steps

    console.log('') // write blank link to overwrite
    const interval = setInterval(step, stepLength)

    function step() {
      count++

      if (count >= steps) {
        clearInterval(interval)

        undoLastLine()
        console.log(`sleep (${durationInMs / 1000}s)`)
        resolve('DONE')
        return
      }

      undoLastLine()
      console.log(
        [
          'sleep ',
          ...Array(count).fill(SLEEP_DONE),
          ...Array(steps - count).fill(SLEEP_TODO),
          '\n',
        ].join('')
      )
    }
  })
}
function undoLastLine() {
  readline.moveCursor(process.stdout, 0, -1)
  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 4) // indent
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
