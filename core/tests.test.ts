import 'mocha'
import Entropy from '.'
import { spinChain, spinThreshold, sleep, removeDB } from '../testing-utils'
import { readKey } from './utils'
const { assert } = require('chai')
import { BigNumber, ethers } from 'ethers'

const aliceAddress = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
const aliceStashAddress = '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY' // `subkey inspect //Alice//stash` 'public key'

describe('Core Tests', async () => {
  let entropy: Entropy
  let chainProcess, serverProcess1, serverProcess2
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a' // `subkey inspect //Alice` 'secret seed'

  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  // This registers Alice with AliceStash as the constraint mod account, no initial constraints
  const registerAlice = async () => {
    const root = process.cwd()
    const thresholdKey = await readKey(`${root + '/testing-utils/test-keys/0'}`)
    const thresholdKey2 = await readKey(
      `${root + '/testing-utils/test-keys/1'}`
    )

    // either works or not working from clean state and keys already there, good error, working error
    try {
      await entropy.register(
        [thresholdKey, thresholdKey2],
        aliceStashAddress,
        false
      )
    } catch (e: any) {
      console.log(e)
      assert.equal(e, 'Error: already registered')
    }
  }

  beforeEach(async function () {
    // try {
    //   chainProcess = await spinChain(chainPath)
    //   serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
    //   serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
    // } catch (e) {
    //   console.log(e)
    // }
    await sleep(3000)
    entropy = await Entropy.setup(aliceSeed)
  })

  afterEach(async function () {
    // const substrate = entropy.substrate.api.disconnect()
    // const server1 = serverProcess1.kill()
    // const server2 = serverProcess2.kill()
    // const chain = chainProcess.kill()
    // const removeDb = removeDB()

    // await Promise.all([substrate, server1, server2, chain, removeDb])
    await sleep(1000)
  })

  it.skip(`registers then signs`, async () => {
    await registerAlice()

    const tx: ethers.utils.UnsignedTransaction = {
      to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
      value: BigNumber.from('1'),
      chainId: 1,
      nonce: 1,
      data: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes('Created On Entropy')
      ),
    }

    // good error, only running one node so sig will not happen
    try {
      await entropy.sign(tx, false, 0)
    } catch (e: any) {
      assert.equal(
        e.message,
        "Cannot read properties of undefined (reading 'data')"
      )
    }
  })

  it(`constraints can be updated by authorized user`, async () => {
    // setup
    await registerAlice()

    const newConstraints = {
      evmAcl: {
        addresses: ['0x1000000000000000000000000000000000000000'],
        kind: 'Allow',
        allowNullRecipient: false,
      }
    }
    const newConstraintsString = JSON.stringify(newConstraints.evmAcl)
    const initialConstraints = await entropy.getConstraints(aliceAddress)

    const randomConstraintsSeed =
      '0x1a7d114100653850c65edecda8a9b2b4dd65d900edef8e70b1a6ecdcda967056' // `subkey inspect //Bob//stash` 'secret seed'
    const randomEntropy = await Entropy.setup(randomConstraintsSeed)

    const aliceConstraintAccountSeed =
      '0x3c881bc4d45926680c64a7f9315eeda3dd287f8d598f3653d7c107799c5422b3' // `subkey inspect //Alice//stash` 'secret seed'
    const aliceConstraintEntropy = await Entropy.setup(aliceConstraintAccountSeed)
    
    // make sure constraints can't be updated by her entropy account
    try {
      await entropy.updateConstraints(newConstraints, aliceAddress)
      throw Error // shouldn't get here
    } catch (e: any) {
      assert.equal(e.message, "constraints.NotAuthorized: Constraint account doesn't have permission to modify these constraints")
    }

    // make sure random user cannot update her constraints
    try {
      await randomEntropy.updateConstraints(newConstraints, aliceAddress)
      throw Error //shouldn't get here
    } catch (e: any) {
      assert.equal(e.message, "constraints.NotAuthorized: Constraint account doesn't have permission to modify these constraints")
    }

    // make sure constriants haven't been updated at all
    const constraint = await entropy.getConstraints(aliceAddress)
    assert.equal(constraint.toString(), initialConstraints.toString())
    // update constraints with AliceStash
    await aliceConstraintEntropy.updateConstraints(newConstraints, aliceAddress)

    // make sure constraints have been updated
    const constraints2 = await entropy.getConstraints(aliceAddress)
    assert.notEqual(constraints2.toString(), initialConstraints.toString())
    assert.equal(constraints2.toString(), JSON.stringify(newConstraints.evmAcl))

    await sleep(1000)
    await sleep(1000)
  })
})

