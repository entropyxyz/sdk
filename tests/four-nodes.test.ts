import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'
import * as util from '@polkadot/util'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
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
  const entries = await run('signingGroups', entropy.substrate.query.stakingExtension.signingGroups.entries())

  const subGroups = entries.map((group) => {
      // aka: subGroup
      const keyGroup = group[1]
      console.log('')
      // omg polkadot type gen is a head ache
      // @ts-ignore: next line
      return keyGroup.unwrap()
  })
  t.equal(subGroups.length, 2, 'expecting 2 subgroups')
  t.equal(subGroups[0].length, 2, 'expecting 2 validators per subgroup')
  await entropy.close()
  t.end()
})
