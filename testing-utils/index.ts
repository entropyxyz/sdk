export { spinChain, spinThreshold, sleep, removeDB } from './spinUp'

import { BigNumber, ethers } from 'ethers'
import { readKey } from '../core/utils'
import Entropy from '../core/index'

/**
 * Register Alice on-chain and on-server using test threshold keys
 *
 * @async
 * @returns {unknown}
 */
export const registerTestUser = async (entropy: Entropy) => {
  const root = process.cwd()
  const thresholdKey = await readKey(`${root + '/testing-utils/test-keys/0'}`)
  const thresholdKey2 = await readKey(`${root + '/testing-utils/test-keys/1'}`)
  return entropy.register(
    [thresholdKey, thresholdKey2],
    '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    false
  ) // constraint mod account is alice stash, ie `subkey inspect //Alice//stash`
}

// Default local threshold server address/port
export const LOCAL_SERVER = '127.0.0.1:3001'

// Example unsigned transaction used tor testing
// Should eventually work with the constraints set to registerTestUser()'s
export const exampleUnsignedEvmTx = (): ethers.utils.UnsignedTransaction => {
  return {
    to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
    value: BigNumber.from('1'),
    chainId: 1,
    nonce: 1,
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes('Created On Entropy')),
  }
}
