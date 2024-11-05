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

export async function jumpStartNetwork (entropy, logFinalReport=false) {
  let timeout, unsub
  // if you used spinNetworkUp check what network was used
  // this is done this way so we can still use this for other
  // applications
  if (global.networkType && global.networkType !== 'four-nodes') throw new Error(`jump start requires four-nodes network you are running: ${global.networkType}`)
  const wantedMethod = 'FinishedNetworkJumpStart'
  const startTime = Date.now()
  let startHeader, started
  let headersSenseStart = 0
  let lastEventTime = 0
  const isDone = new Promise(async (res, reject) => {
    // if timeout is hit, testing should be exited.
    const blockUnsub = await entropy.substrate.derive.chain.subscribeNewHeads(async (header) => {
      if (!startHeader) startHeader = header
      if (started) {
        headersSenseStart++

      }
      if (
        // we tried once
        started &&
        // and this isnt the first block
        headersSenseStart > 0 &&
        // and its been some set of 50 sense start
        headersSenseStart % 50 === 0 &&
        // and i dont want to try more then 3 times
        headersSenseStart <= 150
        ) {
        await entropy.substrate.tx.registry.jumpStartNetwork()
          .signAndSend(entropy.keyring.accounts.registration.pair)
      }

      if (headersSenseStart === 200) {
        reject('waiting period of 200 blocks sense initial jump start reached')
        blockUnsub()
        unsub()
      }
    })
    unsub = await entropy.substrate.query.system.events((records) => {
      const nowEvents = Date.now()
      lastEventTime = nowEvents
      if (records.find(record => record?.event?.method === wantedMethod)) {
        unsub()
        blockUnsub()
        res(undefined)
      } else if (records.find(record => record?.event?.method === 'StartedNetworkJumpStart')) {
        started = true
      }
    })
  })

  await entropy.substrate.tx.registry.jumpStartNetwork()
    .signAndSend(entropy.keyring.accounts.registration.pair)

  return isDone.then(() => {
    if (logFinalReport) console.log(`
final report:jump-start
total-time: ${Math.floor((Date.now() - startTime)/1000)} seconds
total-block-time: ${headersSenseStart} blocks
      `)
  }).catch((err) => {console.error(err); process.exit(1)})
}

export async function spinNetworkDown (networkType = 'four-nodes') {
  if (process.env.ENTROPY_DONT_KILL) {
    console.warn('$ENTROPY_DONT_KILL is set not spinning the network down')
    return false
  }
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

export function createTimeLogProxy (extraStartData={}) {
  let lastLoggedTime
  let edits = 0
  return new Proxy({ time: { start: (lastLoggedTime = Date.now()) }, ...extraStartData }, {
    set: (o, k, v) => {
      const now = Date.now()
      if (k === 'finished') o.time['total time in seconds'] = (Date.now() - o.time.start)/1000
      else o.time[`${edits} - "${k}" seconds since last log`] = (now - lastLoggedTime)/1000
      ++edits
      lastLoggedTime = now
      return o[k] = v
    }
  })
}
