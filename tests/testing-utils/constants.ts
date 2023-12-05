import { BigNumber, ethers } from 'ethers'

export const x25519_public_key_alice =
  '0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22'

export const aliceAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'
export const aliceSeed =
  '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
export const aliceStashSeed =
  '0x3c881bc4d45926680c64a7f9315eeda3dd287f8d598f3653d7c107799c5422b3' // `subkey inspect //Alice//stash` 'secret seed'

export const bobSeed =
  '0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89' // `subkey inspect //Bob` 'secret seed'

export const charlieSeed =
  '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938'
export const charlieAddress = '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y'
export const charlieStashSeed =
  '0x66256c4e2f90e273bf387923a9a7860f2e9f47a1848d6263de512f7fb110fc08'
export const charlieStashAddress =
  '5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT'

export const daveSeed =
  '0x868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246' // `subkey inspect //Dave` 'secret seed'
export const daveStashSeed =
  '0x8766312742c2ebdc78713dab36f8eb328d30d053d702da8167e4672d615f421e' // `subkey inspect //Dave//stash` 'secret seed'
export const daveStashAddress =
  '5HKPmK9GYtE1PSLsS1qiYU9xQ9Si1NcEhdeCq9sw5bqu4ns8'

export const eveSeed =
  '0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a'
export const eveAddress = '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw'
export const eveStashSeed =
  '0x26eda5da160bf8e1810336f97a31d3271fe8b386c4e5b7b4367e55ea33f297d0'
export const eveStashAddress =
  '5FCfAonRZgTFrTd9HREEyeJjDpT397KMzizE6T3DvebLFE7n'

export const whitelisted_test_evm_address =
  '0x772b9a9e8aa1c9db861c6611a82d251db4fac990'
export const non_whitlisted_test_evm_address =
  '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d'

export const whitelisted_test_constraints = {
  evmAcl: {
    addresses: [whitelisted_test_evm_address],
    kind: 'Allow',
    allowNullRecipient: false,
  },
}

export function toHex(value) {
  return '0x' + BigInt(value).toString(16);
}

/// A transaction request that satisfies the test whitelisted constraints
export const whitelisted_test_tx_req = {
  to: whitelisted_test_evm_address,
  value: 1, 
  chainId: 1,
  nonce: 1,
  data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
}

export const non_whitelisted_test_tx_req = {
  to: '', 
  value: toHex(1), 
  chainId: 1,
  nonce: 1,
  data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
}
