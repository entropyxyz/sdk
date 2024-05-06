import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'
import { execFileSync } from 'child_process'
import { getWallet } from '../src/keys'
import { EntropyAccount } from '../src'
import tape from 'tape'

let entropy: Entropy
let pointer
let isRegisteredBefore
const testSetup = async () => {
  await sleep(300000)
  try {
    await spinNetworkUp()
    entropy = await createTestAccount(entropy)
    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    pointer = await entropy.programs.dev.deploy(dummyProgram)
  } catch (error) {
    console.error('Error spinning up network', error)
  }

  return { entropy, pointer }
}

tape('Register Tests: check pre-registration status', async (suite) => {
  try {
    ;({ entropy, pointer } = await testSetup())
  } catch (error) {
    console.error('Error setting up test', error)
  }

  // Check if already registered before the test
  isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
  suite.notOk(isRegisteredBefore)

  try {
    await spinNetworkDown('two-nodes', entropy)
  } catch (error) {
    console.error('Error spinning network down', error)
  } finally {
    suite.end()
  }
})

tape('Register Tests: handle user registration', async (suite) => {
  try {
    ;({ entropy, pointer } = await testSetup())
  } catch (error) {
    console.error('Error setting up test', error)
  }

  await entropy.register({
    programModAccount: charlieStashAddress,
    keyVisibility: 'Permissioned',
    freeTx: false,
    initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
  })

  const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
  suite.ok(isRegisteredAfter)

  try {
    await spinNetworkDown('two-nodes', entropy)
  } catch (error) {
    console.error('Error spinning network down', error)
  } finally {
    suite.end()
  }
})

tape('Register Tests: not allow re-registration', async (suite) => {
  try {
    ;({ entropy, pointer } = await testSetup())
  } catch (error) {
    console.error('Error setting up test', error)
  }

  await entropy.register({
    programModAccount: charlieStashAddress,
    keyVisibility: 'Permissioned',
    freeTx: false,
    initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
  })

  await sleep(120000)
  suite.throws(
    () =>
      entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: true,
        initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
      }),
    undefined,
    { message: 'already registered' }
  )

  try {
    await spinNetworkDown('two-nodes', entropy)
  } catch (error) {
    console.error('Error spinning network down', error)
  } finally {
    suite.end()
  }
})

tape(
  'Register Tests: verify registration status of a new address',
  async (suite) => {
    try {
      ;({ entropy, pointer } = await testSetup())
    } catch (error) {
      console.error('Error setting up test', error)
    }

    const isNewAddressRegistered = await entropy.isRegistered(
      '5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo'
    )
    suite.notOk(isNewAddressRegistered)

    try {
      await spinNetworkDown('two-nodes', entropy)
    } catch (error) {
      console.error('Error spinning network down', error)
    } finally {
      suite.end()
    }
  }
)
