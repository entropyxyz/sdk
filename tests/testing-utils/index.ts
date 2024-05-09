import * as readline from 'readline'

import Entropy, { EntropyAccount } from '../../src'
import { getWallet } from '../../src/keys'
import { charlieStashSeed } from './constants'

export * from './constants'
export * from './network'
export * from './readKey'

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

  await sleep(process.env.GITHUB_WORKSPACE ? 20_000 : 5_000)
  // HACK: (mix) locally 5s is sufficient... github crashes out?
  entropy = new Entropy({ account: entropyAccount })
  await entropy.ready.catch((err) => {
    console.log('createTestAccount failed', err)
    throw err
  })
  return entropy
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

    const startTime = Date.now()
    return promise
      .then((result) => {
        const time = (Date.now() - startTime) / 1000
        const pad = Array(40 - message.length)
          .fill('-')
          .join('')
        t.pass(`${message} ${pad} ${time}s`)
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
