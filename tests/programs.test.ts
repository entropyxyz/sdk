import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  eveSeed,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'four-nodes'

test('Programs: account programs get', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType)
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
  // wait for entropy to be ready
  await run(
    'entropy ready',
    entropy.ready
  )
  await run('jump-start network', jumpStartNetwork(entropy))


  // deploy
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm'
  )

  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram)
  )

  // register
  const registerOpts = {
    programData: [{
      program_pointer: newPointer
    }],
  }

  const verifyingKeyFromRegistration = await run('register', entropy.register(registerOpts))

  t.equal(
    verifyingKeyFromRegistration,
    entropy.keyring.accounts.registration.verifyingKeys[0],
    'verifyingKeys match after registration'
  )

  const programsForAccount = await run(
    'get programs for verifyingKey',
    entropy.programs.get(verifyingKeyFromRegistration)
  )

  t.equal(
    programsForAccount.length,
    1,
    'eve entropy account has 1 program' + programsForAccount
  )

  t.equal(
    programsForAccount[0].program_pointer,
    newPointer,
    'program in list matches new pointer: ' + newPointer + ' = ' + programsForAccount[0].program_pointer
  )

  t.end()
})
