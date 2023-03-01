import { isValidSubstrateAddress } from './utils'
const { assert } = require('chai')

describe('Utils Tests', () => {
  it(`isValidSubstrateAddress() is true for valid account`, async () => {
    const aliceStash = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc'
    assert.equal(isValidSubstrateAddress(aliceStash), true)
  })

  it(`isValidSubstrateAddress() is false for wrong account lengths`, async () => {
    const invalidAccount = '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsS' // shorter than allowed
    assert.equal(isValidSubstrateAddress(invalidAccount), false)
  })

  it(`isValidSubstrateAddress() is false for garbage account address`, async () => {
    const invalidAccount = 'benjamin is cool' // invalid input
    assert.equal(isValidSubstrateAddress(invalidAccount), false)
  })
})
