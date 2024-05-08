import test from 'tape'
import { readFileSync } from 'fs'
import Entropy from '../src'

import {
  sleep,
  charlieStashAddress,
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'

async function testSetup(t) {
  let timeout: any

  try {
    timeout = setTimeout(() => {
      throw new Error('test setup failed')
    }, 300000)

    // @ts-ignore
    await spinNetworkUp()
    entropy = await createTestAccount(entropy)
    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    pointer = await entropy.programs.dev.deploy(dummyProgram)
  } catch (error) {
    t.error(error, 'test setup succeeded')
  }

  clearTimeout(timeout)
  return { entropy, pointer }
}

async function testTeardown(t) {
  try {
    await spinNetworkDown('two-nodes', entropy)
  } catch (error) {
    console.error('Error spinning network down', error)
  } finally {
    t.end()
  }
}

let entropy: Entropy
let pointer: string
let isRegisteredBefore: boolean

test('Register Tests: check pre-registration status', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))

  // Check if already registered before the test
  isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
  t.notOk(isRegisteredBefore)

  testTeardown(t)
})

test('Register Tests: handle user registration', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))

  await entropy.register({
    programModAccount: charlieStashAddress,
    keyVisibility: 'Permissioned',
    freeTx: false,
    initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
  })

  const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
  t.ok(isRegisteredAfter)

  testTeardown(t)
})

test('Register Tests: not allow re-registration', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))

  await entropy.register({
    programModAccount: charlieStashAddress,
    keyVisibility: 'Permissioned',
    freeTx: false,
    initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
  })

  // QUESTION: why is there this massive wait?!
  await sleep(120000)

  t.throws(
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

  testTeardown(t)
})

test('Register Tests: verify registration status of a new address', async (t) => {
  ;({ entropy, pointer } = await testSetup(t))

  const isNewAddressRegistered = await entropy.isRegistered(
    '5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo'
  )
  t.notOk(isNewAddressRegistered)

  testTeardown(t)
})
