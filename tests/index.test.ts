import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  spinChain,
  spinThreshold,
  sleep,
  removeDB,
  disconnect,
  modifyOcwPostEndpoint,
  charlieSeed,
  charlieAddress,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_tx_req,
  non_whitelisted_test_tx_req,
  whitelisted_test_constraints,
} from './testing-utils'
import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { buf2hex, stripHexPrefix } from '../src/utils'

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2

  const chainPath = process.cwd() + '/tests/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/tests/testing-utils/test-binaries/server'
  // devnet endpoint. providing no endpoint defaults to local chain spinup
  // const customEndpoint = 'ws://devnet-forfrankie-nodes-617e8e312bab1d9f.elb.us-west-2.amazonaws.com:9944'

  beforeEach(async () => {
    jest.setTimeout(30000)
    try {
     serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
      chainProcess1 = await spinChain(chainPath, 'alice', '9944')
      await sleep(3000)
      chainProcess2 = await spinChain(chainPath, 'bob', '9945')
      await sleep(3000)

      // Handle process errors
      const processes = [
        serverProcess1,
        serverProcess2,
        chainProcess1,
        chainProcess2,
      ]
      processes.forEach((proc) => {
        proc.on('error', (error) => {
          console.error('Error in process:', error)
        })
      })
    } catch (e) {
      console.log(e)
    }
    await sleep(9000)
    await modifyOcwPostEndpoint(
      'ws://127.0.0.1:9945',
      'http://localhost:3002/user/new'
    )
    entropy = new Entropy({
      seed: charlieStashSeed,
      // devnet endpoint
      // endpoint: customEndpoint
    })

    // Wait for the entropy instance to be ready
    await entropy.ready
  })
  afterEach(async () => {
    jest.setTimeout(30000)
    try {
      await disconnect(entropy.substrate)
      await sleep(6000)
      serverProcess1.kill()
      serverProcess2.kill()
      chainProcess1.kill()
      chainProcess2.kill()
      await sleep(6000)
      removeDB()
    } catch (e) {
      console.error('Error in afterEach:', e.message)
    }
  })

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)

    try {
      await entropy.register({
        address: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: false,
      })
    } catch (e) {
      console.error('Error in test:', e.message)
    }

    expect(entropy.keys.wallet.address).toBe(charlieStashAddress)
    console.log('pre registration')
    expect(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    ).toBeTruthy()
    console.log('post registration')

    // Set a program for the user
    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    await entropy.programs.set(dummyProgram)
    console.log('set program')
    // Retrieve the program and compare
    const fetchedProgram: ArrayBuffer = await entropy.programs.get()
    const trimmedBuffer = fetchedProgram.slice(1)

    expect(buf2hex(trimmedBuffer)).toEqual(buf2hex(dummyProgram))

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

    const signature: any = await entropy.sign({
      sigRequestHash: serializedTx,
    })

    // encoding signature
    console.log('pre signature')
    expect(signature.length).toBe(65)
    console.log('post signature')
    // await disconnect(charlieStashEntropy.substrate)
  })
})
