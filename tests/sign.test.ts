import test, { Test } from 'tape'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  spinNetworkDown,
  charlieStashSeed,
  charlieSeed,
} from './testing-utils'

const NETWORK_TYPE = 'two-nodes'

const msg = Buffer
  .from('Hello world: new signature from entropy!')
  .toString('hex')


async function setupTest (t: Test): Promise<{ entropy: Entropy; run: any }> {
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
  await run('jump Start Network', jumpStartNetwork(entropy))
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

test('Sign: Long Message', async t => {
  const { run, entropy } = await setupTest(t)

  const dummyLongMessage = `Deep Divide Have Grass Blessed Greater Replenish
  Tree Days You're Seed Earth Above
  Blessed beginning god give air above green. God have. Midst. Moved made divided seasons light in be place years above gathered. Days which day waters.
  
  Seasons
  Given one moving darkness appear. You Lesser moving saw. They're divided rule air his seasons. Fifth lights be gathering upon gathering gathering darkness, over. Whales.
  
  Adding some symbols for good measure: #$@%@#$@#%#@`;

  const signature = await run(
    'sign',
    entropy.signWithAdaptersInOrder({
      msg: { msg: dummyLongMessage },
      order: ['deviceKeyProxy'],
    })
  )

  t.true(signature && signature.length > 32, 'signature has some body!')
  signature && console.log(signature)

  t.end()
})

test('Sign: custom signatureVerifyingKey', async (t) => {
  const run = promiseRunner(t)

  /* Setup Network */
  await run('network up', spinNetworkUp(NETWORK_TYPE))
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
  const charlieStashEntropy = new Entropy({
    keyring: charlieStashKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  const charlieKeyring = new Keyring({ seed: charlieSeed, debug: true })
  const charlieEntropy = new Entropy({
    keyring: charlieKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await Promise.all([
    await run('charlieStashEntropy ready', charlieStashEntropy.ready),
    await run('charlieEntropy ready', charlieEntropy.ready)
  ])
  await run('charlie stash register', charlieStashEntropy.register())
  // HACK: when registering the same account twice in this test, the verifying keys returned are the exact same.
  // charlie stash keys [
  //  '0x02836d642dd49256c8b771ee54f2b497decd23362b1f2e0e7d37643bab7100e4c0',
  //  '0x02836d642dd49256c8b771ee54f2b497decd23362b1f2e0e7d37643bab7100e4c0'
  // ]
  // thus failing the notEqual test below. Calling the register method on charlieEntropy seems to fix this and
  // generate different keys
  // charlie stash keys [
  //   '0x03b7a59059a8aafb631b1b8a6e8266cfd76ef3bb9b15c6c2d80a331fc1438a616e',
  //   '0x023145efe2b7360085123893f1dbfb8e6c31b209f2ee11fa556c25c1bd8bd6bf8e'
  // ]
  await run('charlie register', charlieEntropy.register())
  await run('charlie stash register 2', charlieStashEntropy.register())
  
  /* Sign */
  const msg = Buffer
    .from('Hello world: new signature from charlieStashEntropy!')
    .toString('hex')

  // no rhyme or reason for the choice of using the verifying key from Charlie, needed to use
  // a different verifying key than the one retrieved in the SigningManager for Charlie Stash
  const signatureVerifyingKey = charlieStashEntropy.keyring.accounts.deviceKey.verifyingKeys[1]

  t.notEqual(signatureVerifyingKey, charlieStashEntropy.signingManager.verifyingKey, 'choose non-default signatureVerifyingKey')

  const signature = await run(
    'sign',
    charlieStashEntropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
      signatureVerifyingKey
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