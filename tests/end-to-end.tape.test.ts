import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  charlieStashAddress,
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'
import { ProgramData } from '../src/programs'
import * as util from '@polkadot/util'
import tape from 'tape'
export const count = 8
// QN @naynay: What was this needed for again frankie?
const networkNeeds = true

const networkType = 'two-nodes'
let entropy: Entropy
tape('End To End Test Suite', async (suite) => {
  try {
    await spinNetworkUp(networkType)
    entropy = await createTestAccount(entropy)
    const programsAvailable = await entropy.programs.get(charlieStashAddress)
    console.log('programs available', programsAvailable)

    // if (programsAvailable) {
    //   await Promise.all(programsAvailable.map(async (program) => {
    //     await entropy.programs.remove(program.programPointer, charlieStashAddress)
    //   }));
    // }
  } catch (error) {
    console.error(
      'Error in spinning network up or creating test account',
      error.message
    )
  }

  // console.log('entropy', entropy);

  const basicTxProgram: any = readFileSync(
    './tests/testing-utils/template_basic_transaction.wasm'
  )
  console.log('basic program', basicTxProgram.toString())

  const pointer = await entropy.programs.dev.deploy(basicTxProgram)
  console.log('pointer 1', pointer)

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
  // test 1
  suite.notOk(preRegistrationStatus)
  // test 2
  suite.equal(JSON.stringify(preRegistrationStatus), 'false')

  await entropy.register({
    keyVisibility: 'Permissioned',
    freeTx: false,
    // initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
    initialPrograms: [programData],
    programModAccount: charlieStashAddress,
  })
  // test 3
  suite.ok(entropy.account.verifyingKey)
  // test 4
  suite.equal(entropy.account.sigRequestKey.wallet.address, charlieStashAddress)
  // test 5
  const preRegistrationStatusCheck =
    await entropy.registrationManager.checkRegistrationStatus(
      charlieStashAddress
    )
  suite.ok(preRegistrationStatusCheck)

  // Post-registration check

  const postRegistrationStatus = await entropy.isRegistered(charlieStashAddress)
  // test 6
  suite.ok(postRegistrationStatus)

  const postStringifiedResponse = JSON.stringify(postRegistrationStatus)

  // QN @naynay: What is the need of this conditional if we are testing for truthiness?
  if (postStringifiedResponse === 'false') {
    console.log('is not registered')
  }
  // test 7
  suite.equal(postStringifiedResponse, 'true')

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

  console.log('CHARLIES PROGRAMS', programs)
  // removing charlie program barebones
  await entropy.programs.remove(newPointer, charlieStashAddress)
  const updatedRemovedPrograms = await entropy.programs.get(charlieStashAddress)

  const basicTx = {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: 1,
    chainId: 1,
    nonce: 1,
    data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
  }

  const signature = (await entropy.signTransaction({
    txParams: basicTx,
    type: 'eth',
  })) as string

  // encoding signature
  console.log('SIGGGG', signature)
  // test 8
  suite.equal(signature.length, 228)
  // await disconnect(charlieStashEntropy.substrate)
  try {
    await spinNetworkDown(networkType, entropy)
  } catch (error) {
    console.error('Error while spinning network down', error.message)
  }

  suite.end()
})
