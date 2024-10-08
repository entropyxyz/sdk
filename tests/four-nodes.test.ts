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


test.only('test the four-nodes docker script for subgroups', async (t) => {
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
  await entropy.substrate.tx.registry.jumpStartNetwork().signAndSend(entropy.keyring.accounts.registration.pair)
  const wantedMethod = 'FinishedNetworkJumpStart'
  let unsub
  await new Promise(async (res, reject) => {
    unsub = await entropy.substrate.query.system.events((events) => {
      events.forEach(async (record) => {
        const { event } = record
        const { method } = event
        console.log('method', method, event.toHuman())
        if (method === 'ExtrinsicFailed') console.log('ExtrinsicFailed:', event.toHuman().data.dispatchError)
        if (method === wantedMethod) {
          unsub()
          res(undefined)
        }
      })
    })
  })

  const validators = (await run('validators', entropy.substrate.query.session.validators())).toHuman()
  const signingGroup = (await run('signingGroup', entropy.substrate.query.stakingExtension.signers())).toHuman()
  console.log('validators:', validators)
  console.log('signingGroup:', signingGroup)
  t.equal(signingGroup.length, 3, 'expecting 3 validators in the signing group')
  await entropy.close()
  t.end()
})
