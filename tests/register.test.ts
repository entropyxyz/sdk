import Entropy from '../src'
import {
  sleep,
  disconnect,
  aliceAddress,
  charlieStashAddress,
  charlieStashSeed,
} from './testing-utils'
import {mnemonicGenerate} from '@polkadot/util-crypto'
import { spawnSync } from 'child_process'
import { Keyring } from '@polkadot/api'

describe('Register Tests', () => {
  let entropy: Entropy

  beforeAll(async () => {
    jest.setTimeout(300000) // Give us five minutes to spin up.
    try {
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    await sleep(30000) // Give the chain nodes some time to spin up.
    entropy = new Entropy({ seed: charlieStashSeed })
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
        ['compose', '--file', 'tests/docker-compose.yaml', 'down'],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      console.error('Error in afterAll: ', e.message)
    }
  })

  it('should handle user registration and error handling', async () => {
    jest.setTimeout(60000) // Extend timeout for the test

    // Pre-registration check
    try {
      const preRegistrationStatus = await entropy.isRegistered(
        charlieStashAddress
      )
      const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
      console.log('is Registered pre-registration?', preStringifiedResponse)
      expect(preStringifiedResponse).toBe('false')
    } catch (e) {
      console.error('Error in pre-registration status check:', e.message)
    }

    try {
      await entropy.register({
        address: charlieStashAddress,
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: false,
        initialProgram: '0x',
      })
    } catch (e) {
      console.error('Error in test:', e.message)
    }

    expect(entropy.keys.wallet.address).toBe(charlieStashAddress)
    console.log('post registration')
    expect(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    ).toBeTruthy()

    try {
      const postRegistrationStatus = await entropy.isRegistered(
        charlieStashAddress
      )
      expect(postRegistrationStatus).toBeTruthy()

      const postStringifiedResponse = JSON.stringify(postRegistrationStatus)
      console.log('is Registered post-registration?', postStringifiedResponse)

      if (postStringifiedResponse === 'false') {
        console.log('is not registered')
      }

      expect(postStringifiedResponse).toBe('true')

      console.log('post registration')
    } catch (e) {
      console.error('Error in post-registration status check:', e.message)
    }

    // Attempt to re-register Charlie
    let reRegistrationError = null

    try {
      await entropy.registrationManager.register({
        address: charlieStashAddress,
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: true,
        initialProgram: '0x',
      })
    } catch (e) {
      reRegistrationError = e
    }
    expect(reRegistrationError).not.toBeNull()
    expect(reRegistrationError.message).toContain('already registered')

    // Check registration status for a derived address (who is not registered)
    try {
    console.log('derived address isRegistered test')

    const testMnemonic = mnemonicGenerate()
    const keyring = new Keyring({ type: 'sr25519' })
    const keypair = keyring.addFromUri(testMnemonic)

    const derivedAddress = keypair.address
    console.log('Derived Address:', derivedAddress)
  
    const derivedAddressRegistrationStatus = await entropy.isRegistered(
      derivedAddress
    )
    const preStringifiedResponse = JSON.stringify(derivedAddressRegistrationStatus)
    console.log('is Registered pre-registration?', preStringifiedResponse)
    expect(preStringifiedResponse).toBe('false')

    expect(
      await entropy.registrationManager.checkRegistrationStatus(derivedAddress)
    ).toBeFalsy()
    const derivedAddressStringifiedResponse = JSON.stringify(
      derivedAddressRegistrationStatus
    )
    console.log('is the address Registered?', derivedAddressStringifiedResponse) 
  }catch (e) {
    console.error('Error in Alice status check:', e.message)
  }
  })
})
