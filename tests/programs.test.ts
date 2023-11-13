import { readFileSync } from 'fs'
import { SignatureLike } from '@ethersproject/bytes'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieSeed,
  charlieAddress,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_tx_req,
  non_whitelisted_test_tx_req,
  whitelisted_test_constraints,
  aliceSeed,
  aliceAddress
} from './testing-utils'
import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { buf2hex, stripHexPrefix } from '../src/utils'
import { spawnSync } from 'child_process'

describe('Programs Tests', () => {
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

  it('should handle programs', async () => {
    jest.setTimeout(60000)

    // Test registration
    console.log("pre-register")
    try {
      await entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: false,
        initialProgram: '0x'
      })
    } catch (e) {
      console.error('Error in registration:', e.message)
    }
    console.log("post-register")

    const dummyProgram = readFileSync('./tests/testing-utils/template_barebones.wasm')

    // Test authorization
    const isAuthorized = await entropy.programs.checkAuthorization(charlieStashAddress, charlieStashAddress)
    expect(isAuthorized).toBeTruthy()

    const notAuthorized = await entropy.programs.checkAuthorization(charlieStashAddress, aliceAddress)
    expect(notAuthorized).toBeFalsy()

    await entropy.programs.set(dummyProgram, charlieStashAddress)
    const fetchedProgram = await entropy.programs.get(charlieStashAddress)
    expect(buf2hex(fetchedProgram)).toEqual(buf2hex(dummyProgram))

    // Test unauthorized program setting
    let unauthorizedErrorCaught = false
    try {
      await entropy.programs.set(dummyProgram, aliceAddress, charlieStashAddress)
    } catch (error) {
      unauthorizedErrorCaught = error.message.includes("not authorized to modify the program")
    }
    expect(unauthorizedErrorCaught).toBeTruthy()

    // pass an invalid program eventually 
    let invalidProgramErrorCaught = false
    try {
      await entropy.programs.set(new ArrayBuffer(0), charlieStashAddress)
    } catch (error) {
      invalidProgramErrorCaught = error.message.includes("Invalid program data")
    }
    expect(invalidProgramErrorCaught).toBeTruthy()

    
}) })