import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_tx_req,
  aliceAddress
} from './testing-utils'
import { ethers } from 'ethers'
import { buf2hex } from '../src/utils'
import { Keyring } from '@polkadot/api'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { spawnSync } from 'child_process'

describe('Core Tests', () => {
  let entropy: Entropy

  beforeAll(async () => {
    jest.setTimeout(300000) // Give us five minutes to spin up.
    try {
      spawnSync(
        "docker",
        [ "compose", "--file", "tests/docker-compose.yaml", "up", "--detach" ],
        { shell: true, stdio: 'inherit' } // Use shell's search path.
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
        "docker",
        [ "compose", "--file", "tests/docker-compose.yaml", "down" ],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
        console.error('Error in afterAll: ', e.message)
    }
  })

it('should handle registration, program management, and signing', async () => {
  jest.setTimeout(60000)
  
  // Pre-registration check
  try {
      const preRegistrationStatus = await entropy.isRegistered(charlieStashAddress)
      expect(preRegistrationStatus).toBeFalsy()
      const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
      console.log("is Registered pre-registration?", preStringifiedResponse)
      expect(preStringifiedResponse).toBe('false')
  } catch (e) {
      console.error('Error in pre-registration status check:', e.message)
  }
  
  try {
    await entropy.register({
      programModAccount: charlieStashAddress,
      keyVisibility: 'Permissioned',
      freeTx: false,
      initialProgram: '0x'
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
    const postRegistrationStatus = await entropy.isRegistered(charlieStashAddress)
    expect(postRegistrationStatus).toBeTruthy()
  
    const postStringifiedResponse = JSON.stringify(postRegistrationStatus)
    console.log("is Registered post-registration?", postStringifiedResponse)
  
    if (postStringifiedResponse === 'false') {
      console.log("is not registered")
    }
  
    expect(postStringifiedResponse).toBe('true')
  
    console.log('post registration')
  } catch (e) {
    console.error('Error in post-registration status check:', e.message)
  }
  
    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )

  
    console.log('setting program')
    await entropy.programs.set(dummyProgram, charlieStashAddress)
    console.log('program set')
    console.log('program get')
    const fetchedProgram: ArrayBuffer = await entropy.programs.get()
    const trimmedBuffer = fetchedProgram.slice(1)

    expect(buf2hex(trimmedBuffer)).toEqual(buf2hex(dummyProgram))

    let unauthorizedErrorCaught = false

    const testMnemonic = mnemonicGenerate()
    const keyring = new Keyring({ type: 'sr25519' })
    const keypair = keyring.addFromUri(testMnemonic)

    const derivedAddress = keypair.address
    console.log('Derived Address:', derivedAddress)

    try {
      console.log("false program test")
      await entropy.programs.set(dummyProgram, derivedAddress, charlieStashAddress)
      fail('derivedAddress should not be authorized to set the program for Charlie')
    } catch (error) {
      if (error.message.includes("Program modification account doesn't have permission to modify this program")) {
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
    const serializedTx = ethers.utils.serializeTransaction(
      whitelisted_test_tx_req
    )

    console.log('pre signature')
    const signature: Uint8Array = await entropy.sign({
      sigRequestHash: serializedTx,
    })
    // encoding signature
    expect(signature.length).toBe(65)
    console.log('post signature')
    // await disconnect(charlieStashEntropy.substrate)
  })
})
