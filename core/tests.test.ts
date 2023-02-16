import 'mocha'
import Entropy from '.'
import { readKey } from './utils'
import { spinChain, spinThreshold, sleep, removeDB } from '../testing-utils'
const { assert } = require('chai')
import { BigNumber, ethers } from 'ethers'

describe('Core Tests', async () => {
  let entropy: Entropy
  let chainProcess, serverProcess1, serverProcess2
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    chainProcess = await spinChain(chainPath)
    serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
    serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
    await sleep(3000)
    entropy = await Entropy.setup(aliceSeed)
  })

  afterEach(async function () {
    entropy.substrate.api.disconnect()
    serverProcess1.kill()
    serverProcess2.kill()
    chainProcess.kill()
    removeDB()
  })

  it(`registers then signs`, async () => {
    const root = process.cwd()
    const thresholdKey = await readKey(`${root + '/testing-utils/test-keys/0'}`)
    const thresholdKey2 = await readKey(`${root + '/testing-utils/test-keys/1'}`)

    // either works or not working from clean state and keys already there, good error, working error
    try {
      // TODO use register() in substrate, not directly
      await entropy.register(
        [thresholdKey, thresholdKey2],
        '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
        false
      ) // constraint mod account is alice stash, ie `subkey inspect //Alice//stash`
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
})
