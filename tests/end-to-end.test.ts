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
import { ProgramInstance } from '../src/programs'

const networkType = 'two-nodes'

const msg = Buffer.from('Hello world: signature from entropy!').toString('hex')

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
  // const bareBones: any = readFileSync(
  //   './tests/testing-utils/template_barebones.wasm'
  // )
  // t.equal(typeof bareBones.toString(), 'string', 'got basic program')

  // QUESTION: how to launch substrate node with a particular address pre-funded

  // const pointer = await run(
  //   'deploy program',
  //   entropy.programs.dev.deploy(bareBones)
  // )
  // t.equal(typeof pointer, 'string', 'valid pointer')

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

  const noopProgramInstance: ProgramInstance = {
    programPointer: newPointer,
    programConfig: '',
  }

  console.debug('verifyingKey', verifyingKey)
  const programsBeforeAdd = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )

  t.equal(programsBeforeAdd.length, 1, 'charlie has 1 programs')

  await run('add program', entropy.programs.add(noopProgramInstance))
  // getting charlie programs
  const programsAfterAdd = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )

  t.equal(
    programsAfterAdd.length,
    2,
    'charlie has 2 programs' + JSON.stringify(programsAfterAdd)
  )

  // removing deviceKey
  const deviceKeyProxyPointer =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  await run(
    'remove DeviceKeyProxy program',
    entropy.programs.remove(deviceKeyProxyPointer, verifyingKey)
  )

  const programsAftreRemoveDefault = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )
  t.equal(
    programsAftreRemoveDefault.length,
    1,
    'charlie has 1 program' + JSON.stringify(programsAftreRemoveDefault)
  )

  const signature = await run(
    'sign',
    entropy.sign({
      sigRequestHash: msg,
      hash: 'sha3',
    })
  )
  t.equal(util.u8aToHex(signature).length, 132, 'got a good sig')
  t.end()
})
