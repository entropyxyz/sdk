import test from 'tape'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
  spinNetworkDown,
  charlieStashSeed,
  charlieSeed,
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

test('Sign: Inputted Verifying Keys', async (t) => {
  const run = promiseRunner(t)

  /* Setup Network */
  await run('network up', spinNetworkUp(NETWORK_TYPE))
  await sleep(process.env.GITHUB_WORKSPACE ? 30_000 : 5_000)
  t.teardown(async () => {
    // this gets called after all tests are run
    await charlieStashEntropy.close()
    await charlieEntropy.close()
    await spinNetworkDown(NETWORK_TYPE).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  /* Setup Entropy */
  await run('wasm', wasmGlobalsReady())
  const charlieStashKeyring = new Keyring({ seed: charlieStashSeed, debug: true })
  const charlieKeyring = new Keyring({ seed: charlieSeed, debug: true })
  const charlieStashEntropy = new Entropy({
    keyring: charlieStashKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })
  const charlieEntropy = new Entropy({
    keyring: charlieKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await Promise.all([
    run('charlieStashEntropy ready', charlieStashEntropy.ready),
    run('charlieEntropy ready', charlieEntropy.ready)
  ])
  await Promise.all([
    run('charlie stash register', charlieStashEntropy.register()),
    run('charlie register', charlieEntropy.register())
  ])

  /* Sign */
  const msg = Buffer
    .from('Hello world: new signature from charlieStashEntropy!')
    .toString('hex')

  const signature = await run(
    'sign',
    charlieStashEntropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
      // no rhyme or reason for the choice of using the charlie seed verifying key, needed to use
      // a pre-loaded acct on our local devnet in order to get a valid verifying key
      signatureVerifyingKey: charlieEntropy.keyring.accounts.deviceKey.verifyingKeys[0]
    })
  )

  t.true(signature && signature.length > 32, 'signature has some body!')
  signature && console.log(signature)

  t.end()
})
