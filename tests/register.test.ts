import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
} from './testing-utils'
import { spawnSync } from 'child_process'
import { mnemonicGenerate, mnemonicToMiniSecret} from '@polkadot/util-crypto'
import { Keyring } from '@polkadot/api'

describe('Register Tests', () => {
  let entropy
  let isRegisteredBefore

  beforeAll(async () => {
    jest.setTimeout(300000) // Set timeout for the entire suite

    // Spin up the test environment
    spawnSync('docker', ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'], { shell: true, stdio: 'inherit' })

    const keyOptions = {
        seed: charlieStashSeed,
      }

    await sleep(30000) // Give the chain nodes some time to spin up.
    entropy = new Entropy({ keyOptions: keyOptions })
    await entropy.ready
    })

  afterAll(async () => {
    try {
      await disconnect(entropy.substrate)
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'down'],
        { shell: true, stdio: 'inherit' }
      )
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'logs'],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      console.error('Error in afterAll: ', e.message)
    }
  })

  it('should check pre-registration status', async () => {

    // Check if already registered before the test
    isRegisteredBefore = await entropy.isRegistered(charlieStashAddress)
    expect(isRegisteredBefore).toBeFalsy()

  })


  it('should handle user registration', async () => {
    if (!isRegisteredBefore) {
      await entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: false,
        initialProgram: '0x',
      })

      const isRegisteredAfter = await entropy.isRegistered(charlieStashAddress)
      expect(isRegisteredAfter).toBeTruthy()
    }
  })
  it('should not allow re-registration', async () => {
    await expect(
      entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: true,
        initialProgram: '0x',
      })
    ).rejects.toThrow('already registered')
  });

  it('should verify registration status of a new address', async () => {

    const isNewAddressRegistered = await entropy.isRegistered("5FWd3NSnWQ6Ay9CXmw9aTU8ZvDksn7zzzuw5dCKq9R8DsaCo")
    expect(isNewAddressRegistered).toBeFalsy()
  })
})
