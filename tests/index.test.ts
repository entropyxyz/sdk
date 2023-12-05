import { readFileSync } from 'fs'
import { EntropyAccount } from '../src'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_tx_req,
} from './testing-utils'
import { Keyring } from '@polkadot/api'
import { getWallet } from '../src/keys'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { buf2hex } from '../src/utils'
import { spawnSync } from 'child_process'
import { Transaction } from 'ethereumjs-tx'

describe('Core Tests', () => {
  let entropy: Entropy

  beforeAll(async () => {
    jest.setTimeout(300000) // Give us five minutes to spin up.
    try {
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'],
        { shell: true, stdio: 'inherit' } // Use shell's search path.
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    const signer = await getWallet(charlieStashSeed)

    const entropyAccount: EntropyAccount = {
      sigRequestKey: signer.pair,
      programModKey: signer.pair
    }

    await sleep(30000)
    entropy = new Entropy({ account: entropyAccount})
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

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)

    // Pre-registration check
    console.log("pre-registration check")
    try {
      const preRegistrationStatus = await entropy.isRegistered(
        charlieStashAddress
      )
      expect(preRegistrationStatus).toBeFalsy()
      const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
      expect(preStringifiedResponse).toBe('false')
    } catch (e) {
      console.error('Error in pre-registration status check:', e.message)
    }

    try {
      await entropy.register({
        keyVisibility: 'Permissioned',
        freeTx: false,
        programModAccount: charlieStashAddress,
      })
    } catch (e) {
      console.error('Error in test:', e.message)
    }
    console.log('verifyingKey:', entropy.account.verifyingKey)
    expect(entropy.account.verifyingKey).toBeTruthy()
    expect(entropy.account.sigRequestKey.wallet.address).toBe(charlieStashAddress)
    expect(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    ).toBeTruthy()

    // Post-registration check
    console.log("post-registration check")

    try {
      const postRegistrationStatus = await entropy.isRegistered(
        charlieStashAddress
      )
      expect(postRegistrationStatus).toBeTruthy()

      const postStringifiedResponse = JSON.stringify(postRegistrationStatus)

      if (postStringifiedResponse === 'false') {
        console.log('is not registered')
      }

      expect(postStringifiedResponse).toBe('true')

    } catch (e) {
      console.error('Error in post-registration status check:', e.message)
    }

    // Set a program for the user
    console.log("setting program")

    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    await entropy.programs.set(dummyProgram)
    // Retrieve the program and compare
    console.log("getting program")
    const fetchedProgram: ArrayBuffer = await entropy.programs.get()
    const trimmedBuffer = fetchedProgram.slice(1)

    expect(buf2hex(trimmedBuffer)).toEqual(buf2hex(dummyProgram))

    let unauthorizedErrorCaught = false

    const testMnemonic = mnemonicGenerate()
    const keyring = new Keyring({ type: 'sr25519' })
    const keypair = keyring.addFromUri(testMnemonic)

    const derivedAddress = keypair.address

    console.log("not authorized to set program test")


    try {
      await entropy.programs.set(dummyProgram, derivedAddress)
      expect(
        'derivedAddress should not be authorized to set the program for Charlie'
      )
    } catch (error) {
      if (
        error.message.includes(
          "Program modification account doesn't have permission to modify this program"
        )
      ) {
        unauthorizedErrorCaught = true
      } else {
        throw error
      }
    }

    expect(unauthorizedErrorCaught).toBeTruthy()

    // signing attempts should fail cause we haven't set constraints yet
    /*    const no_constraint: any = await entropy.sign({
      sigRequestHash: keccak256(ethers.utils.serializeTransaction(whitelisted_test_tx_req)),
      freeTx: false,
      retries: 3
    })
    expect(no_constraint.length).toBe(0)

    // set user's constraints on-chain
    const charlieStashEntropy = new Entropy({
      seed: charlieStashSeed
    })

    // signing should fail with a non-whitelisted tx requests
    const wrong_constraint: any = await entropy.sign({
      sigRequestHash: keccak256(ethers.utils.serializeTransaction(non_whitelisted_test_tx_req)),
      freeTx: false,
      retries: 3
    })
    expect(wrong_constraint.length).toBe(0)
*/
    // signing should work for whitelisted tx requests
    console.log("signing test")


    const tx = new Transaction(whitelisted_test_tx_req)

    const serializedTx = tx.serialize().toString('hex')
    
    const signature: Uint8Array = await entropy.sign({
      sigRequestHash: serializedTx,
    })
    // encoding signature
    expect(signature.length).toBe(65)
    // await disconnect(charlieStashEntropy.substrate)
  })
})
