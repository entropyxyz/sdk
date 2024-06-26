import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  charlieStashSeed,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'two-nodes'

test('Programs: GET', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType)
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

  // register
  const verifyingKeyFromRegistration = await run('register', entropy.register())

  t.equal(
    verifyingKeyFromRegistration,
    entropy.keyring.accounts.registration.verifyingKeys[0],
    'verifyingKeys match after registration'
  )

  // deploy
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm'
  )

  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram)
  )

  const programsDeployed = await run(
    'get deployed programs',
    entropy.programs.dev.get(charlieStashAddress)
  )

  t.equal(
    programsDeployed.length,
    1,
    'charlie has deployed 1 program' + programsDeployed
  )

  t.equal(
    programsDeployed[0],
    newPointer,
    'program in list matches new pointer: ' + newPointer + ' = ' + programsDeployed[0]
  )

  t.end()
})
