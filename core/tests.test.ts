import Entropy from '.'
import { spinChain, spinThreshold, sleep, removeDB } from '../testing-utils'
import { readKey } from './utils'
const { assert } = require('chai')
import { BigNumber, ethers } from 'ethers'
import { changeEndpoint } from '../testing-utils/spinUp'

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    try {
      // do the spin chain
      serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
      chainProcess1 = await spinChain(chainPath, 'alice', '9944')
      await sleep(3000)
      chainProcess2 = await spinChain(chainPath, 'bob', '9945')
      // change change bob to listen on port 3002.
    } catch (e) {
      console.log(e)
    }
    await sleep(5000)
    await changeEndpoint("ws://localhost:9945", "http://localhost:3002/signer/new_party")
    // call insert_keys on chain2() + drop the api connection
    entropy = await Entropy.setup(aliceSeed)
  })

  afterEach(async function () {
    entropy.substrate.api.disconnect()
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
        constraintModificationAccount:
          '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
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

    const signature: any = await entropy.sign(tx, false, 15)
    assert.equal(signature.length, 65)
  })
})
