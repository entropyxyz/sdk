import { BigNumber, utils } from 'ethers/lib/ethers'

const aliceSeed =
  '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
const aliceStash = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'
export const ALICE = Object.freeze({
  SEED: aliceSeed,
  STASH: aliceStash,
})

export const CONSTRAINT = Object.freeze({
  modificationAccount: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
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
