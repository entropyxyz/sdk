import test from 'tape'
import { readFileSync } from 'fs'
import * as util from '@polkadot/util'
import Entropy from '../src'
import {
  promiseRunner,
  spinNetworkUp,
  createTestAccount,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'
import { ProgramInstance } from '../src/programs'

const networkType = 'two-nodes'
let entropy: Entropy

test('End To End', async (t) => {
  const run = promiseRunner(t)

  await run('network up', spinNetworkUp(networkType))
  entropy = await run('account', createTestAccount(entropy))

  t.teardown(async () => {
    await spinNetworkDown(networkType, entropy).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  const basicTxProgram: any = readFileSync(
    './tests/testing-utils/template_basic_transaction.wasm'
  )
  t.equal(typeof basicTxProgram.toString(), 'string', 'got basic program')

  const pointer = await run(
    'deploy program',
    entropy.programs.dev.deploy(basicTxProgram)
  )
  t.equal(typeof pointer, 'string', 'valid pointer')

  const config = `
    {
      "allowlisted_addresses": [
        "772b9a9e8aa1c9db861c6611a82d251db4fac990"
      ]
    }
  `
  // convert to bytes
  const encoder = new TextEncoder()
  const byteArray = encoder.encode(config)

  // convert u8a to hex
  const programConfig = util.u8aToHex(new Uint8Array(byteArray))

  const programData: ProgramInstance = {
    programPointer: pointer,
    programConfig: programConfig,
  }

  // Pre-registration check
  const preRegistrationStatus = await run(
    'isRegistered',
    entropy.isRegistered(charlieStashAddress)
  )
  t.equal(
    JSON.stringify(preRegistrationStatus),
    'false',
    'charlie not yet registered'
  )

  await run(
    'register',
    entropy.register({
      programDeployer: charlieStashAddress,
      programData: [programData]
    })
  )
  t.equal(
    entropy.keyring.getRegisteringKey(),
    charlieStashAddress,
    'got right address'
  )
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

  // Post-registration check
  const postRegistrationStatus = await run(
    'isRegistered',
    entropy.isRegistered(charlieStashAddress)
  )
  t.equal(
    JSON.stringify(postRegistrationStatus),
    'true',
    'isRegistered = true'
  )

  //  loading second program
  const dummyProgram: any = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(dummyProgram)
  )
  const secondProgramData: ProgramInstance = {
    programPointer: newPointer,
    programConfig: '',
  }
  await run(
    'add program',
    entropy.programs.add(secondProgramData, charlieStashAddress)
  )
  // getting charlie programs
  const programs = await run(
    'get programs',
    entropy.programs.get(charlieStashAddress)
  )
  t.equal(programs.length, 2, 'charlie has 2 programs')

  // removing charlie program barebones
  await run(
    'remove program',
    entropy.programs.remove(newPointer, charlieStashAddress, verifyingKey)
  )
  const updatedRemovedPrograms = await run(
    'get programs',
    entropy.programs.get(charlieStashAddress)
  )
  t.equal(updatedRemovedPrograms.length, 1, 'charlie has 1 program')

  const basicTx = {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: 1,
    chainId: 1,
    nonce: 1,
    data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
  }

  const signature = await run(
    'signTransaction',
    entropy.signWithAdapter({
      msg: basicTx,
      type: 'device-key-proxy',
    })
  )

  t.equal(signature.length, 228, 'got a good sig')

  t.end()
})
