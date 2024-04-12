import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
} from './testing-utils'
import { execFileSync } from 'child_process'
import { getWallet } from '../src/keys'
import { EntropyAccount } from '../src'

describe('Register Tests', () => {
  let entropy
  let isRegisteredBefore
  let pointer
  beforeAll(async () => {
    jest.setTimeout(300000) // Set timeout for the entire suite

    // Spin up the test environment
      execFileSync(
        'dev/bin/spin-up.sh',
        ['two-nodes'],
        { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
      )

    try {
      const signer = await getWallet(charlieStashSeed)

      const entropyAccount: EntropyAccount = {
        sigRequestKey: signer,
        programModKey: signer,
        programDeployKey: signer,
      }

      await sleep(30000)
      entropy = new Entropy({ account: entropyAccount})
      const dummyProgram: any = readFileSync(
        './tests/testing-utils/template_barebones.wasm'
      )
      await entropy.ready
      pointer = await entropy.programs.dev.deploy(dummyProgram)
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }
  })

  afterAll(async () => {
    try {
      await disconnect(entropy.substrate)
    } catch (e) {
      console.error('Error during disconnect in afterAll: ', e.message)
    }
    execFileSync(
      'dev/spin-down.sh',
      ['two-nodes'],
      { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
    )
  })

  it('should check pre-registration status', async () => {
    // Check if already registered before the test
    isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
    expect(isRegisteredBefore).toBeFalsy()
  })

  it('should handle user registration', async () => {
    await entropy.register({
      programModAccount: charlieStashAddress,
      keyVisibility: 'Permissioned',
      freeTx: false,
      initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
    })

    const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
    expect(isRegisteredAfter).toBeTruthy()
  })

  it('should not allow re-registration', async () => {
    await expect(
      entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: true,
        initialPrograms: [{ programPointer: pointer, programConfig: '0x' }],
      })
    ).rejects.toThrow('already registered')
  })

  it('should verify registration status of a new address', async () => {
    const isNewAddressRegistered = await entropy.isRegistered("5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo")
    expect(isNewAddressRegistered).toBeFalsy()
  })
})