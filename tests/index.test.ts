// LUIS THIS IS THE TEST THAT NEEDS TO PASS
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
import { readKeyasync } from '../src/utils'
import { utils } from 'ethers'
const { assert } = require('chai')

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2

  const chainPath = process.cwd () + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd () + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    try {
      serverProcess1 = await spinThreshold (serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold (serverPath, 'bob', '3002')
      chainProcess1 = await spinChain (chainPath, 'alice', '9944')
      await sleep (3000)
      chainProcess2 = await spinChain (chainPath, 'bob', '9945')
    } catch (e) {
      console.log(e)
    }
    await sleep (9000)
    await modifyOcwPostEndpoint(
      'ws://127.0.0.1:9945',
      'http://localhost:3002/signer/new_party'
    )
    entropy = new Entropy({ seed: charlieSeed })
  })

  afterEach(async function () {
    await disconnect (entropy.substrate)
    await sleep (3000)
    serverProcess1.kill()
    serverProcess2.kill()
    chainProcess1.kill()
    chainProcess2.kill()
    await sleep(3000)
    removeDB()
  })

  it(`registers, sets constraints, tries valid and invalid tx req, and signs`, async () => {
    const root = process.cwd()
    const thresholdKey = await readKeyasync (
      `${root + '/testing-utils/test-keys/0'}`
    )
    const thresholdKey2 = await readKeyasync (
      `${root + '/testing-utils/test-keys/1'}`
    )

    // register user on-chain and with threshold servers
    await entropy.register ({
      initialProgram: charlieStashAddress,
      freeTx: false,
    })

    // do we need to hash whitelisted_test_tx_req
    // signing attempts should fail cause we haven't set constraints yet

    const txHash = utils.keccak256 (
      utils.serializeTransaction(whitelisted_test_tx_req)
    )

    const no_constraint: any = await entropy.sign({
      sigRequestHash: txHash,
      freeTx: false,
      retries: 3,
    })
    assert.equal(no_constraint.length, 0)

    // set user's constraints on-chain
    const charlieStashEntropy = new Entropy({
      seed: charlieStashSeed,
    })
    // await charlieStashEntropy.constraints.updateAccessControlList(
    //   whitelisted_test_constraints,
    //   charlieAddress
    // )

    // signing should fail with a non-whitelisted tx requests
    const txHash_fail = utils.keccak256(
      utils.serializeTransaction(non_whitelisted_test_tx_req)
    )

    const wrong_constraint: any = await entropy.sign ({
      sigRequestHash: txHash_fail,
      freeTx: false,
      retries: 3,
    })
    assert.equal(wrong_constraint.length, 0)

    // signing should work for whitelisted tx requests
    const txHash_pass = utils.keccak256 (
      utils.serializeTransaction(whitelisted_test_tx_req)
    )

    const signature: any = await entropy.sign ({
      sigRequestHash: txHash_pass,
      freeTx: false,
      retries: 10,
    })
    assert.equal(signature.length, 65)
    await charlieStashEntropy.substrate.disconnect()
  })
})
