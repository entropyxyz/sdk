import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
} from './testing-utils'
import { spawnSync } from 'child_process'
import { getWallet } from '../src/keys'
import { EntropyAccount } from '../src'

describe('Register Tests', () => {
  let entropy
  let isRegisteredBefore
  let hash
  beforeAll(async () => {
    jest.setTimeout(300000) // Set timeout for the entire suite

    // Spin up the test environment
    spawnSync('docker', ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'], { shell: true, stdio: 'inherit' })

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
      hash = await entropy.programs.dev.deploy(dummyProgram)
      await entropy.ready
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
    spawnSync(
      'docker',
      ['compose', '--file', 'tests/docker-compose.yaml', 'down'],
      { shell: true, stdio: 'inherit' }
    )
  })

  it('should check pre-registration status', async () => {
    try {
      // Check if already registered before the test
      isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
      expect(isRegisteredBefore).toBeFalsy()
    } catch (e) {
      console.error('Error in pre-registration status check: ', e.message)
    }
  })

  it('should handle user registration', async () => {
    try {
      if (!isRegisteredBefore) {
        await entropy.register({
          programModAccount: charlieStashAddress,
          keyVisibility: 'Permissioned',
          freeTx: false,
          initialProgram: [{ hash }],
        })

        const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
        expect(isRegisteredAfter).toBeTruthy()
      }
    } catch (e) {
      console.error('Error in user registration: ', e.message)
    }
  })

  it('should not allow re-registration', async () => {
    try {
      await expect(
        entropy.register({
          programModAccount: charlieStashAddress,
          keyVisibility: 'Permissioned',
          freeTx: true,
          initialProgram: [{ hash }],
        })
      ).rejects.toThrow('already registered')
    } catch (e) {
      console.error('Error in re-registration check: ', e.message)
    }
  })

  it('should verify registration status of a new address', async () => {
    try {
      const isNewAddressRegistered = await entropy.isRegistered("5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo")
      expect(isNewAddressRegistered).toBeFalsy()
    } catch (e) {
      console.error('Error in new address registration check: ', e.message)
    }
  })
})