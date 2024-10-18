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
  const startTime = Date.now()
  let startHeader, started
  let headersSenseStart = 0
  let lastEventTime = 0
  const isDone = new Promise(async (res, reject) => {
    // if timeout is hit, testing should be exited.
    timeout = setTimeout(() => { blockUnsub(); unsub(); reject(new Error('jump-start network timed out'))}, maxTime)
    const blockUnsub = await entropy.substrate.derive.chain.subscribeNewHeads(async (header) => {
      if (!startHeader) startHeader = header
      if (started) {
        headersSenseStart++
        if (lastEventTime) console.log('context#headers time sense last events seen:', Math.floor((Date.now() - lastEventTime)/1000), 'seconds')

      }
      if (started && headersSenseStart > 0 && headersSenseStart % 50 === 0) {
        await entropy.substrate.tx.registry.jumpStartNetwork()
          .signAndSend(entropy.keyring.accounts.registration.pair)
        console.log('retrying jumpstart', headersSenseStart, 'headers sense initial try')
      }

      console.log(`#${header.number}: ${header.author}`);
    })
    unsub = await entropy.substrate.query.system.events((records) => {
      const nowEvents = Date.now()
      if (lastEventTime) console.log('context#events time sense last events:', Math.floor((nowEvents - lastEventTime)/1000), 'seconds')
      lastEventTime = nowEvents
      console.log('time sense start:', Math.floor((Date.now() - startTime)/1000), 'seconds')
      console.log('event methods:', records.map((record) => record?.event?.method))
      if (records.find(record => record?.event?.method === wantedMethod)) {
        unsub()
        blockUnsub()
        clearTimeout(timeout)
        res(undefined)
      } else if (records.find(record => record?.event?.method === 'StartedNetworkJumpStart')) {
        started = true
      }
    })
  })

  await entropy.substrate.tx.registry.jumpStartNetwork()
    .signAndSend(entropy.keyring.accounts.registration.pair)

  await isDone.catch((err) => {console.error(err); process.exit(1)})
}

export async function spinNetworkDown (networkType = 'four-nodes') {
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
