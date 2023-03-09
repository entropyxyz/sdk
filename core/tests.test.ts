import Entropy from '.'
import {
  spinChain,
  spinThreshold,
  sleep,
  removeDB,
  exampleUnsignedEvmTx,
  registerTestUser,
} from '../testing-utils'

describe('Core Tests', () => {
  let entropy: Entropy
  let chainProcess, serverProcess1, serverProcess2
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/testing-utils/test-binaries/server'

  beforeEach(async function () {
    try {
      chainProcess = await spinChain(chainPath)
      serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
    } catch (e) {
      console.log(e)
    }
    await sleep(7000)
    entropy = await Entropy.setup(aliceSeed)
  })

  afterEach(async function () {
    entropy.substrate.api.disconnect()
    serverProcess1.kill()
    serverProcess2.kill()
    chainProcess.kill()
    removeDB()
  })

  it(`registers user`, async () => {
    await registerTestUser(entropy)
    await entropy.sign(exampleUnsignedEvmTx(), false, 3)
  })
})
