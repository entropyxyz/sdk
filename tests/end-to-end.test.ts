import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
  charlieStashSeed,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'
import { ProgramInstance } from '../src/programs'

const networkType = 'two-nodes'

test('End To End', async (t) => {
  const run = promiseRunner(t)
  // context: all run does is checks that it runs
  await run('network up', spinNetworkUp(networkType))
  await sleep(5_000)
  // this gets called after all tests are run
  t.teardown(async () => {
    await spinNetworkDown(networkType, entropy).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  await run('wasm', wasmGlobalsReady())

  let store = {}
  const keyring = new Keyring({ seed: charlieStashSeed, debug: true })
  keyring.accounts.on('account-update', (fullAccount) => {
    store = fullAccount
  })

  t.equal(
    keyring.accounts.registration.address,
    charlieStashAddress,
    'got right address'
  )

  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await run('entropy ready', entropy.ready)

  /* deploy */
  const bareBones: any = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  t.equal(typeof bareBones.toString(), 'string', 'got basic program')

  // QUESTION: how to launch substrate node with a particular address pre-funded

  const pointer = await run(
    'deploy program',
    entropy.programs.dev.deploy(bareBones)
  )
  t.equal(typeof pointer, 'string', 'valid pointer')

  // register
  const verifyingKeyFromRegistration = await run('register', entropy.register())
  t.equal(
    verifyingKeyFromRegistration,
    entropy.keyring.accounts.registration.verifyingKeys[0],
    'verifyingKeys match after registration'
  )

  //
  // sign some data
  //

  // NEED PRE-REGISTRATION TEST
  // const preRegistrationStatusCheck = await run(
  //   'checkRegistrationStatus',
  //   entropy.substrate.query.registry.registered(verifyingKey)
  //   // entropy.registrationManager.checkRegistrationStatus(charlieStashAddress)
  // )
  // t.ok(preRegistrationStatusCheck, 'preRegistrationStatusCheck ...') // TODO: better check

  // Use the verifyingKey from ProgramManager

  const verifyingKey = entropy.programs.verifyingKey
  t.ok(verifyingKey, 'verifyingKey exists')

  const registrationStatus = await run(
    'check registration',
    entropy.substrate.query.registry.registered(verifyingKey)
  )

  t.ok(registrationStatus, 'Verifying key is registered')

  //  loading second program
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm'
  )
  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram)
  )
  const secondProgramData: ProgramInstance = {
    programPointer: newPointer,
    programConfig: '',
  }
  console.debug('verifyingKey', verifyingKey)
  await run('add program', entropy.programs.add(secondProgramData))
  // getting charlie programs
  const programs = await run('get programs', entropy.programs.get(verifyingKey))
  t.equal(programs.length, 2, 'charlie has 2 programs')

  // removing charlie program barebones
  await run('remove program', entropy.programs.remove(newPointer, verifyingKey))
  const updatedRemovedPrograms = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )
  t.equal(updatedRemovedPrograms.length, 1, 'charlie has 1 program')

  const basicTx = {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: 1,
    chainId: 1,
    nonce: 1,
    data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
  }

  // const signature = await entropy.sign({
  //   sigRequestHash: '0x00',
  //   hash: 'keccak',
  // })

  const signature = await run(
    'signWithAdapter',
    entropy.signWithAdapter({
      msg: basicTx,
      type: 'deviceKeyProxy',
    })
  )

  t.equal(signature.length, 228, 'got a good sig')

  t.end()
})
