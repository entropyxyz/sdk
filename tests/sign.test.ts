import test from 'tape'
import { Entropy, wasmGlobalsReady } from '../src'
import { Keyring } from '../src/keys'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
  spinNetworkDown,
  charlieStashSeed,
} from './testing-utils'

const NETWORK_TYPE = 'two-nodes'

test('Sign', async (t) => {
  const run = promiseRunner(t)

  /* Setup Network */
  await run('network up', spinNetworkUp(NETWORK_TYPE))
  await sleep(process.env.GITHUB_WORKSPACE ? 30_000 : 5_000)
  t.teardown(async () => {
    // this gets called after all tests are run
    await entropy.close()
    await spinNetworkDown(NETWORK_TYPE).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  /* Setup Entropy */
  await run('wasm', wasmGlobalsReady())
  const keyring = new Keyring({ seed: charlieStashSeed, debug: true })
  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })
  await run('entropy ready', entropy.ready)
  await run('register', entropy.register())


  /* Sign */
  const msg = Buffer
    .from('Hello world: new signature from entropy!')
    .toString('hex')

  const signature = await run(
    'sign',
    entropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
    })
  )

  t.true(signature && signature.length > 32, 'signature has some body!')
  signature && console.log(signature)

  t.end()
})
