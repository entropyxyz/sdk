import test from 'tape'

import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  eveSeed,
  // eveAddress,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'four-nodes'

test('test the four-nodes docker script', async (t) => {
  const run = promiseRunner(t)
  // context: all run does is checks that it runs
  await run('network up', spinNetworkUp(networkType))

  // this gets called after all tests are run
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  await run('wasm', wasmGlobalsReady())

  const keyring = new Keyring({ seed: eveSeed, debug: true })
  let store = keyring.getAccount()
  t.equal(store.admin.address, keyring.accounts.registration.pair.address, 'admin account should have an address and for now it should match registrations address')
  keyring.accounts.on('account-update', (fullAccount) => {
    store = fullAccount
  })


  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await run('entropy ready', entropy.ready)
  await run('jump-start network', jumpStartNetwork(entropy))
  const validators = (await run('validators', entropy.substrate.query.session.validators())).toHuman()
  const signingGroup = (await run('signingGroup', entropy.substrate.query.stakingExtension.signers())).toHuman()
  t.equal(validators.length, 4, 'expecting 4 validators in validator set')
  t.equal(signingGroup.length, 3, 'expecting 3 validators in the signing group')
  await entropy.close()
  t.end()
})
