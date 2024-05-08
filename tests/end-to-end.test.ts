import test from 'tape'
import { readFileSync } from 'fs'
import * as util from '@polkadot/util'
import Entropy from '../src'
import { ProgramData } from '../src/programs'

import {
  spinNetworkUp,
  createTestAccount,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'two-nodes'
let entropy: Entropy

test('End To End Test Suite', async (t) => {
  try {
    await spinNetworkUp(networkType)
    entropy = await createTestAccount(entropy)
  } catch (error) {
    t.error(error, 'setup')
    throw error
  }
  t.ok(entropy, 'setup')

  t.teardown(async () => {
    await spinNetworkDown(networkType, entropy).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  const basicTxProgram: any = readFileSync(
    './tests/testing-utils/template_basic_transaction.wasm'
  )
  t.equal(typeof basicTxProgram.toString(), 'string', 'got basic program')

  console.time('deploy')
  const pointer = await entropy.programs.dev.deploy(basicTxProgram)
  console.timeEnd('deploy')
  t.equal(typeof pointer, 'string', 'program deployed (got pointer)')

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

  const programData: ProgramData = {
    programPointer: pointer,
    programConfig: programConfig,
  }

  // Pre-registration check
  const preRegistrationStatus = await entropy.isRegistered(charlieStashAddress)
  t.equal(
    JSON.stringify(preRegistrationStatus),
    'false',
    'charlie not yet registered'
  )

  await entropy.register({
    keyVisibility: 'Permissioned',
    freeTx: false,
    // initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
    initialPrograms: [programData],
    programModAccount: charlieStashAddress,
  })
  t.ok(entropy.account.verifyingKey, 'got verifyingKey post register')
  t.equal(
    entropy.account.sigRequestKey.wallet.address,
    charlieStashAddress,
    'got right address'
  )
  const preRegistrationStatusCheck =
    await entropy.registrationManager.checkRegistrationStatus(
      charlieStashAddress
    )
  t.ok(preRegistrationStatusCheck, 'preRegistrationStatusCheck ...') // TODO: better check

  // Post-registration check
  const postRegistrationStatus = await entropy.isRegistered(charlieStashAddress)
  t.equal(JSON.stringify(postRegistrationStatus), 'true', 'isRegerstered')

  //  loading second program
  const dummyProgram: any = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  const newPointer = await entropy.programs.dev.deploy(dummyProgram)
  const secondProgramData: ProgramData = {
    programPointer: newPointer,
    programConfig: '',
  }
  await entropy.programs.add(secondProgramData, charlieStashAddress)
  // getting charlie programs
  const programs = await entropy.programs.get(charlieStashAddress)
  t.equal(programs.length, 2, 'charlie has 2 programs')

  // removing charlie program barebones
  await entropy.programs.remove(newPointer, charlieStashAddress)
  const updatedRemovedPrograms = await entropy.programs.get(charlieStashAddress)
  t.equal(updatedRemovedPrograms.length, 1, 'charlie has 1 program')

  const basicTx = {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: 1,
    chainId: 1,
    nonce: 1,
    data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
  }

  await entropy
    .signTransaction({
      txParams: basicTx,
      type: 'eth',
    })
    .then((signature: string) => {
      // encoding signature
      t.equal(signature.length, 228, 'got a good sig')
    })
    .catch((err) => t.error(err, 'signature worked'))

  // await disconnect(charlieStashEntropy.substrate)

  t.end()
})