import { BigNumber, utils } from 'ethers/lib/ethers'
import type { UnsignedTransaction } from 'ethers'
import { aliceSeed } from '../../../../testing-utils'

const aliceStash = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'
export const ALICE = Object.freeze({
  SEED: aliceSeed,
  STASH: aliceStash,
})
export const CHARLIE = Object.freeze({
  SEED: '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938',
  ADDRESS: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  STASHED_SEED:
    '0x66256c4e2f90e273bf387923a9a7860f2e9f47a1848d6263de512f7fb110fc08',
  STASHED_ADDRESS: '5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT',
})

export const whitelisted_test_evm_address =
  '0x772b9a9e8aa1c9db861c6611a82d251db4fac990'
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

/// A transaction request that satisfies the test whitelisted constraints
export const whitelisted_test_tx_req: UnsignedTransaction = {
  to: whitelisted_test_evm_address,
  value: BigNumber.from('1'),
  chainId: 1,
  nonce: 1,
  data: utils.hexlify(utils.toUtf8Bytes('Created On Entropy')),
}

/// An invalid transaction request that shouldn't satisfy any whitelisted constraints
export const non_whitelisted_test_tx_req: UnsignedTransaction = {
  to: '', // random evm address from etherscan
  value: BigNumber.from('1'),
  chainId: 1,
  nonce: 1,
  data: utils.hexlify(utils.toUtf8Bytes('Created On Entropy')),
}
