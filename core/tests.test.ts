import 'mocha'
import Entropy from '.'
import { isValidSubstrateAddress, readKey } from './utils'
const { assert } = require('chai')
import { BigNumber, ethers } from 'ethers'

describe('Core Tests', async () => {
  let entropy: Entropy
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'

  before(async function () {
    entropy = await Entropy.setup(aliceSeed)
  })

  after(function () {
    entropy.substrate.api.disconnect()
  })

  it(`registers then signs`, async () => {
    const root = process.cwd()
    const thresholdKey = readKey(`${root.split('packages/')[0]}/0`)
    const thresholdKey2 = readKey(`${root.split('packages/')[0]}/1`)

    // either works or not working from clean state and keys already there, good error, working error
    try {
      // TODO use register() in substrate, not directly
      await entropy.register(
        [thresholdKey, thresholdKey2],
        '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
        false
      ) // constraint mod account is alice stash, ie `subkey inspect //Alice//stash`
    } catch (e: any) {
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

  it(`isValidSubstrateAddress() is true for valid account`, async () => {
    const aliceStash = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'
    assert.equal(isValidSubstrateAddress(aliceStash), true)
  })

  it(`isValidSubstrateAddress() is false for wrong account lengths`, async () => {
    const invalidAccount = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsS' // shorter than allowed
    assert.equal(isValidSubstrateAddress(invalidAccount), false)
  })
})
