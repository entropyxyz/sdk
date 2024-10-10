import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'
import * as util from '@polkadot/util'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  charlieStashSeed,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'four-nodes'


test('test the four-nodes docker script for subgroups', async (t) => {
  const run = promiseRunner(t)
  // context: all run does is checks that it runs
  await run('network up', spinNetworkUp(networkType))

  await sleep(process.env.GITHUB_WORKSPACE ? 30_000 * 2 : 5_000 * 2)

  // this gets called after all tests are run
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  await run('wasm', wasmGlobalsReady())

  const keyring = new Keyring({ seed: charlieStashSeed, debug: true })
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
  await run('jump Start Network', jumpStartNetwork(entropy))
  const validators = (await run('validators', entropy.substrate.query.session.validators())).toHuman()
  const signingGroup = (await run('signingGroup', entropy.substrate.query.stakingExtension.signers())).toHuman()
  console.log('validators, signingGroup', validators, signingGroup)
  t.equal(validators.length, 4, 'expecting 4 validators in validator set')
  t.equal(signingGroup.length, 3, 'expecting 3 validators in the signing group')
  await entropy.close()
  t.end()
})
