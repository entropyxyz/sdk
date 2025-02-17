import test, { Test } from 'tape'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  spinNetworkDown,
  eveSeed,
  charlieSeed,
} from './testing-utils'

const NETWORK_TYPE = 'four-nodes'

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
  const keyring = new Keyring({ seed: eveSeed, debug: true })
  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })
  await run('entropy ready', entropy.ready)
  await run('jump-start network', jumpStartNetwork(entropy))
  await run('register', entropy.register())

  return { run, entropy }
}


test('Sign', async (t) => {
  const { run, entropy } = await setupTest(t)

  /* Sign */

  const signatureData = await run(
    'sign',
    entropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
    })
  )
  t.true(!!signatureData, 'signatureData exists')
  t.true('signature' in signatureData, 'signatureData.signature exists')
  t.true('verifyingKey' in signatureData, 'signatureData.verifyingKey exists')
  t.true('hashType' in signatureData, 'signatureData.hashingAlgorith exists')
  t.true('message' in signatureData, 'signatureData.message exists')
  t.true(signatureData.signature.length > 32, 'signature has some body!')
  signatureData && console.log(signatureData)

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

  const signatureData = await run(
    'sign',
    entropy.signWithAdaptersInOrder({
      msg: { msg: dummyLongMessage },
      order: ['deviceKeyProxy'],
    })
  )

  t.true(signatureData.signature.length > 32, 'signature has some body!')
  signatureData && console.log(signatureData)

  t.end()
})

test('Sign: custom signatureVerifyingKey', async (t) => {
  const run = promiseRunner(t)

  /* Setup Network */
  await run('network up', spinNetworkUp(NETWORK_TYPE))
  t.teardown(async () => {
    // this gets called after all tests are run
    await eveEntropy.close()
    await charlieEntropy.close()
    await spinNetworkDown(NETWORK_TYPE).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  /* Setup Entropy */
  await run('wasm', wasmGlobalsReady())
  const charlieStashKeyring = new Keyring({ seed: eveSeed, debug: true })
  const eveEntropy = new Entropy({
    keyring: charlieStashKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  const charlieKeyring = new Keyring({ seed: charlieSeed, debug: true })
  const charlieEntropy = new Entropy({
    keyring: charlieKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await Promise.all([
    await run('eveEntropy ready', eveEntropy.ready),
    await run('charlieEntropy ready', charlieEntropy.ready)
  ])
  await run('jump-start network', jumpStartNetwork(eveEntropy))
  await run('charlie stash register', eveEntropy.register())
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
  await run('charlie stash register 2', eveEntropy.register())
  
  /* Sign */
  const msg = Buffer
    .from('Hello world: new signature from eveEntropy!')
    .toString('hex')

  // no rhyme or reason for the choice of using the verifying key from Charlie, needed to use
  // a different verifying key than the one retrieved in the SigningManager for Charlie Stash
  const signatureVerifyingKey = eveEntropy.keyring.accounts.deviceKey.verifyingKeys[1]

  t.notEqual(signatureVerifyingKey, eveEntropy.signingManager.verifyingKey, 'choose non-default signatureVerifyingKey')

  const signatureData = await run(
    'sign',
    eveEntropy.signWithAdaptersInOrder({
      msg: { msg },
      order: ['deviceKeyProxy'],
      signatureVerifyingKey
    })
  )

  t.true(signatureData.signature.length > 32, 'signature has some body!')
  signatureData && console.log(signatureData)

  t.end()
})
