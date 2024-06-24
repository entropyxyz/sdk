import test from 'tape'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  spinNetworkDown,
  charlieStashSeed,
} from './testing-utils'

const NETWORK_TYPE = 'two-nodes'

const msg = Buffer
  .from('Hello world: new signature from entropy!')
  .toString('hex')


async function setupTest (t): Promise<{ entropy: Entropy; run: any }> {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(NETWORK_TYPE))
  t.teardown(async () => {
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

  return { run, entropy }
}


test('Sign', async (t) => {
  const { run, entropy } = await setupTest(t)

  /* Sign */

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


test('Sign:issue#380', async (t) => {
  const { run, entropy } = await setupTest(t)
    // issue #380 https://github.com/entropyxyz/sdk/issues/380
  const submitTransactionRequest = entropy.signingManager.submitTransactionRequest
  entropy.signingManager.submitTransactionRequest = async () => {
    // stimulate the retry logic
    entropy.signingManager.submitTransactionRequest = submitTransactionRequest
    throw new Error('Invalid Signer: Invalid Signer in Signing group')
  }
  const signature380 = await run(
    'sign',
    entropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
    })
  )

  t.true(signature380 && signature380.length > 32, 'signature380 has some body!')
  signature380 && console.log(signature380)
  entropy.signingManager.submitTransactionRequest = async () => {
    // stimulate the retry logic to get the error message
    throw new Error('Invalid Signer: Invalid Signer in Signing group')
  }
  try {
    await entropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
    })
  } catch (e) {
    const m = e.message
    t.ok(m.toString().includes('index: 0'), 'error message should show the index')
    t.ok(m.toString().includes('sigRequest: 7b226d7367223a223438363536633663366632303737366637323663363433613230366536353737323037333639363736653631373437353732363532303636373236663664323036353665373437323666373037393231227d'), 'error message should show the sigRequest')
    t.ok(m, 'error message should exist')
    console.log('Full message:', m)
  }


  t.end()
})
