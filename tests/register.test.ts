import test from 'tape'
/*
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

  await sleep(5_000)

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
*/

test('Register', async (t) => {
  t.skip('Needs funded account')
  /*
  await testSetup(t))
  t.teardown(testTeardown)
  const run = promiseRunner(t)

  await run(
    'register',
    entropy.register({
      programDeployer: entropy.keyring.accounts.registration.address,
      programData: [{ programPointer: pointer, programConfig: '0x' }],
    })
  )

  await entropy.register({
    programDeployer: charlieStashAddress,
    programData: [{ programPointer: pointer, programConfig: '0x' }],
  })
    .then(() => t.fail('throws error on duplicate registrations'))
    .catch((err) => t.match(err.message, /already registered/))

  await entropy.close()
  */

  t.end()
})
