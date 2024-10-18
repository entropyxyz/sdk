import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';
import { WebSocket } from 'ws';
import { promisify } from 'util'

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = join(__dirname, '..')
const SECONDS = 1000

// NOTE: you need to edit your /etc/hosts file to use these. See dev/README.md

export async function spinNetworkUp (networkType = 'four-nodes') {
  if (networkType === 'two-nodes') throw new Error('two-node network script has been deprecated')
  global.networkType = networkType
  try {
    execFileSync('dev/bin/spin-up.sh', [networkType], { 
      shell: true, 
      cwd: moduleRoot,
      stdio: 'inherit'
    })
  } catch (err) {
    console.log('spin up failed', err)
    return Promise.reject(err)
  }

  // TODO: pull all the endpoints we want to test from the networkType
  const endpoint = 'ws://127.0.0.1:9944'
  return retryUntil(() => isWebSocketReady(endpoint))
}

async function retryUntil (fn, isSuccess = Boolean, opts = {}) {
  const {
    triesRemaining = process.env.GITHUB_WORKSPACE ? 60 : 10,
    timeout = 1 * SECONDS
  } = opts
  return fn()
    .then(result => {
      if (isSuccess(result)) return result
      else throw Error('retry failed')
    })
    .catch(async (err) => {
      // out of tries, do not recurse
      if (triesRemaining === 1) throw err
      await promisify(setTimeout)(timeout)

      return retryUntil(fn, isSuccess, {
        triesRemaining: triesRemaining - 1,
        timeout
      })
    })
}

async function isWebSocketReady (endpoint) {
  return new Promise((resolve, reject) => {
    try { 
      const ws = new WebSocket(endpoint)
      ws.on('error', (ev) => {
        ws.close()
        reject(Error(ev.message))
      })
      ws.on('open', () => {
        // NOTE: seems to be a sufficient test for our purposes!
        resolve(true)
      })
    } catch (err) {
      console.log('ws error', err.message)
      reject(err)
    }

  })
}

export async function jumpStartNetwork (entropy, maxTime = 360 * SECONDS) {
  let timeout, unsub
  // if you used spinNetworkUp check what network was used
  // this is done this way so we can still use this for other
  // applications
  if (global.networkType && global.networkType !== 'four-nodes') throw new Error(`jump start requires four-nodes network you are running: ${global.networkType}`)
  const wantedMethod = 'FinishedNetworkJumpStart'

  const isDone = new Promise(async (res, reject) => {
    timeout = setTimeout(reject, maxTime, new Error('jump-start network timed out'))

    unsub = await entropy.substrate.query.system.events((records) => {
      if (records.find(record => record?.event?.method === wantedMethod)) {
        unsub()
        clearTimeout(timeout)
        res(undefined)
      }
    })
  })

  entropy.substrate.tx.registry.jumpStartNetwork()
    .signAndSend(entropy.keyring.accounts.registration.pair)

  await isDone
}

export async function spinNetworkDown (networkType = 'two-nodes') {
  try {
    execFileSync('dev/bin/spin-down.sh', [networkType], { 
      shell: true, 
      cwd: moduleRoot,
      stdio: 'inherit'
    })
  } catch (err) {
    return Promise.reject(err)
  }
}
