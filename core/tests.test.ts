import Entropy from '.'
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
  charlieStashAddress
} from '../testing-utils'
import { readKey } from './utils'
import { BigNumber, ethers } from 'ethers'
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
      'ws://localhost:9945',
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
    removeDB()
  })

  it(`registers then signs`, async () => {
    const root = process.cwd()
    const thresholdKey = await readKey(`${root + '/testing-utils/test-keys/0'}`)
    const thresholdKey2 = await readKey(
      `${root + '/testing-utils/test-keys/1'}`
    )

    // either works or not working from clean state and keys already there, good error, working error
    try {
      // TODO use register() in substrate, not directly
      await entropy.register({
        keyShares: [thresholdKey, thresholdKey2],
        constraintModificationAccount: charlieStashAddress,
        freeTx: false,
      })
      // constraint mod account is alice stash, ie `subkey inspect //Alice//stash`
    } catch (e: any) {
      console.log(e)
      assert.equal(e, 'Error: already registered')
    }

    const tx: ethers.utils.UnsignedTransaction = {
      to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
      value: BigNumber.from('1'),
      chainId: 1,
      nonce: 1,
      data: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes('Created On Entropy')
      ),
    }

    // signing should fail cause we haven't set constraints yet
    try {
      await entropy.sign(tx, false, 3);
      throw new Error("Should have errored")
    } catch (e: any) {
      assert.equal(e.message, "Cannot read properties of undefined (reading 'data')")
    }

    // set user's constraints on-chain
    const newConstraints = {
      evmAcl: {
        addresses: ['0x772b9a9e8aa1c9db861c6611a82d251db4fac990'],
        kind: 'Allow',
        allowNullRecipient: false,
      },
    }
    const charlieStashEntropy = await Entropy.setup(charlieStashSeed)
    await charlieStashEntropy.constraints.updateAccessControlList(newConstraints, charlieAddress)

    const signature: any = await entropy.sign(tx, false, 10)
    assert.equal(signature.length, 65)
  })
})
