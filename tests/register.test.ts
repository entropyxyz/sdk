import test from 'tape'
import { readFileSync } from 'fs'
import Entropy from '../src'

import {
  promiseRunner,
  createTimeout,
  sleep,
  charlieStashAddress,
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'

async function testSetup(t: any) {
  const run = promiseRunner(t)
  const timeout = createTimeout(30_000, 'setup')

  await run('network up', spinNetworkUp())
  entropy = await run('account', createTestAccount(entropy))
  const dummyProgram: any = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  pointer = await run(
    'deploy program',
    entropy.programs.dev.deploy(dummyProgram)
  )

  timeout.clear()
  return { entropy, pointer }
}

async function testTeardown() {
  await spinNetworkDown('two-nodes', entropy).catch((err) =>
    console.log('Teardown failed:', err.message)
  )
}

let entropy: Entropy
let pointer: string
let isRegisteredBefore: boolean

test('Register Tests: check pre-registration status', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))
  t.teardown(testTeardown)

  // Check if already registered before the test
  isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
  t.notOk(isRegisteredBefore)

  t.end()
})

test('Register: handle user registration', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))
  t.teardown(testTeardown)

  await entropy.registrationManager.register({
    programDeployer: charlieStashAddress,
    programData: [{ programPointer: pointer, programConfig: '0x' }],
  })

  const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
  t.ok(isRegisteredAfter)

  t.end()
})

test('Register: not allow re-registration', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))
  t.teardown(testTeardown)
  const run = promiseRunner(t)

  await run(
    'register',
    entropy.registrationManager.register({
      programDeployer: entropy.keyring.accounts.registration.address,
      programData: [{ programPointer: pointer, programConfig: '0x' }],
    })
  )

  await entropy.registrationManager
    .register({
      programDeployer: charlieStashAddress,
      programData: [{ programPointer: pointer, programConfig: '0x' }],
    })
    .then(() => t.fail('throws error on duplicate registrations'))
    .catch((err) => t.match(err.message, /already registered/))

  t.end()
})

test('Register Tests: verify registration status of a new address', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))
  t.teardown(testTeardown)

  const isNewAddressRegistered = await entropy.isRegistered(
    '5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo'
  )
  t.notOk(isNewAddressRegistered)

  t.end()
})
