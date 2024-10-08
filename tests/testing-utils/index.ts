import * as readline from 'readline'
// @ts-ignore
import { spinNetworkUp, spinNetworkDown } from '@entropyxyz/sdk/testing'
// NOTE: an implicit test that we're correctly exporting the testing tools!
// WARN: the @ts-ignore is currently required because we've not exported types?

import Entropy, { wasmGlobalsReady } from '../../src'
import Keyring from '../../src/keys'
import { KeyMaterial } from '../../src/keys/types/json'
import { charlieStashSeed } from './constants'

export { spinNetworkUp, spinNetworkDown }

export * from './constants'
export * from './readKey'

export async function createTestAccount(
  seed = charlieStashSeed,
  endpoint = 'ws://127.0.0.1:9944'
) {
  await wasmGlobalsReady()

  const keyring = new Keyring({ seed } as KeyMaterial)
  const entropy = new Entropy({
    keyring,
    endpoint,
  })

  await entropy.ready.catch((err) => {
    console.log('createTestAccount failed: ', err)
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
export function promiseRunner(t: any, keepThrowing = false) {
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
