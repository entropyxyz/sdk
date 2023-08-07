import Entropy from '../src/core'
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
} from '../testing-utils'
import { readKey } from '../src/core/utils'
const { assert } = require('chai')

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2

  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    try {
      serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
      chainProcess1 = await spinChain(chainPath, 'alice', '9944')
      await sleep(3000)
      chainProcess2 = await spinChain(chainPath, 'bob', '9945')
    } catch (e) {
      console.log(e)
    }
    await sleep(9000)
    await modifyOcwPostEndpoint(
      'ws://127.0.0.1:9945',
      'http://localhost:3002/signer/new_party'
    )
    entropy = await Entropy.setup(charlieSeed)
  })

  afterEach(async function () {
    await disconnect(entropy.substrate.api)
    await sleep(3000)
    serverProcess1.kill()
    serverProcess2.kill()
    chainProcess1.kill()
    chainProcess2.kill()
    await sleep(3000)
    removeDB()
  })

  it(`registers, sets constraints, tries valid and invalid tx req, and signs`, async () => {
    const root = process.cwd()
    const thresholdKey = await readKey(`${root + '/testing-utils/test-keys/0'}`)
    const thresholdKey2 = await readKey(
      `${root + '/testing-utils/test-keys/1'}`
    )

    // register user on-chain and with threshold servers
    await entropy.register({
      keyShares: [thresholdKey, thresholdKey2],
      constraintModificationAccount: charlieStashAddress,
      freeTx: false,
    })

    // signing attempts should fail cause we haven't set constraints yet
    const no_constraint: any = await entropy.sign(
      whitelisted_test_tx_req,
      false,
      3
    )
    assert.equal(no_constraint.length, 0)

    // set user's constraints on-chain
    const charlieStashEntropy = await Entropy.setup(charlieStashSeed)
    await charlieStashEntropy.constraints.updateAccessControlList(
      whitelisted_test_constraints,
      charlieAddress
    )

    // signing should fail with a non-whitelisted tx requests
    const wrong_constraint: any = await entropy.sign(
      non_whitelisted_test_tx_req,
      false,
      3
    )
    assert.equal(wrong_constraint.length, 0)

    // signing should work for whitelisted tx requests
    const signature: any = await entropy.sign(
      whitelisted_test_tx_req,
      false,
      10
    )
    assert.equal(signature.length, 65)
    await disconnect(charlieStashEntropy.substrate.api)
  })
})
