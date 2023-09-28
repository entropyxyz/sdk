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
  whitelisted_test_constraints
} from './testing-utils'
import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2

  const chainPath = process.cwd() + '/tests/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/tests/testing-utils/test-binaries/server'

  beforeEach(async () => {
    try {
      serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
      chainProcess1 = await spinChain(chainPath, 'alice', '9944')
      await sleep(3000)
      chainProcess2 = await spinChain(chainPath, 'bob', '9945')

      // Handle process errors
      const processes = [serverProcess1, serverProcess2, chainProcess1, chainProcess2];
      processes.forEach(proc => {
        proc.on('error', (error) => {
          console.error('Error in process:', error);
        })
      });

    } catch (e) {
      console.log(e)
    }
    await sleep(9000)
    await modifyOcwPostEndpoint(
      'ws://127.0.0.1:9945',
      'http://localhost:3002/signer/new_party'
    )
    entropy = new Entropy({
      seed: charlieSeed
    })

    // Wait for the entropy instance to be ready
    await entropy.ready
  })
  afterEach(async () => {
    await disconnect(entropy.substrate)
    await sleep(3000)
    serverProcess1.kill()
    serverProcess2.kill()
    chainProcess1.kill()
    chainProcess2.kill()
    await sleep(3000)
    removeDB()
  })

  it('should handle registration, program management, and signing', async () => {
    await entropy.register({
      address: charlieStashAddress,
      keyVisibility: 'Permissioned',
      freeTx: false,
    })

  
    expect(await entropy.registrationManager.checkRegistrationStatus(charlieStashAddress)).toBeTruthy()

    // Set a program for the user
    const dummyProgram = new ArrayBuffer(8)
    await entropy.programs.set(dummyProgram)

    // Retrieve the program and compare
    const fetchedProgram = await entropy.programs.get()
    expect(fetchedProgram).toEqual(dummyProgram)

    // signing attempts should fail cause we haven't set constraints yet
    const no_constraint: any = await entropy.sign({
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

    // signing should work for whitelisted tx requests
    const signature: any = await entropy.sign({
      sigRequestHash: keccak256(ethers.utils.serializeTransaction(whitelisted_test_tx_req)),
      freeTx: false,
      retries: 10
    })
    expect(signature.length).toBe(65)
    await disconnect(charlieStashEntropy.substrate)
  })

})