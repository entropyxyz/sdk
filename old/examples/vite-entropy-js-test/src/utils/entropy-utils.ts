import { BigNumber, utils } from 'ethers/lib/ethers'
import { aliceSeed } from '../../../../testing-utils'

const aliceStash = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'
export const ALICE = Object.freeze({
  SEED: aliceSeed,
  STASH: aliceStash,
})

// TODO: Write a type for valid and invalid accounts
const invalidAccount = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsS'
enum Chain {
  Entropy = 1,
}

export const tx: utils.UnsignedTransaction = Object.freeze({
  to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
  value: BigNumber.from('1'),
  chainId: Chain.Entropy,
  nonce: 1,
  data: utils.hexlify(utils.toUtf8Bytes('Created On Entropy')),
})
