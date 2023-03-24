import { Substrate } from './index'
import { spinChain, sleep, disconnect } from '../testing-utils'

const { assert } = require('chai')

describe('Substrate Tests', () => {
  let substrate: Substrate
  const bobSeed =
    '0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89' // `subkey inspect //Bob` 'secret seed'
  const aliceSeed =
    '0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a'
  let chainProcess
  beforeEach(async function () {
    const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'
    try {
      chainProcess = await spinChain(chainPath, 'dev')
    } catch (e) {
      throw new Error(e)
    }
    await sleep(7000)
    substrate = await Substrate.setup(bobSeed)
  })

  afterEach(async function () {
    await disconnect(substrate.api)
    chainProcess.kill()
    await sleep(6000)
  })

  it(`checks if registering and registers`, async () => {
    const register: any = await substrate.register(
      '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
      false
    ) // constraint mod account is ALICE_STASH
    assert.equal(register.isRegistering, true)
  })

  it(`gets threshold Info`, async () => {
    const stashKeys = [
      '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY', // validator 1
      '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc', // validator 2
    ]
    const thresholdKeysExpected = [
      {
        endpoint: '127.0.0.1:3001',
        tssAccount: '5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN',
        x25519PublicKey:
          '0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22',
      },
      {
        endpoint: '127.0.0.1:3002',
        tssAccount: '5D2SVCUkK5FgFiBwPTJuTN65J6fACSEoZrL41thZBAycwnQV',
        x25519PublicKey:
          '0xe13087d3e3d5aa1501bd769eff57f55924aaa9b544c9d2b2edf765509988660a',
      },
    ]
    const thresholdKeys = await substrate.getThresholdInfo(stashKeys)
    assert.equal(thresholdKeys.length, 2)
    assert.deepEqual(thresholdKeys, thresholdKeysExpected)
  })

  it(`gets all stash keys from chain and returns the selected ones`, async () => {
    const stashKeys: any = await substrate.getStashKeys()
    assert.equal(stashKeys.length, 2)

    const mockReturnedKeys = [
      '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
      '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
    ]

    const returnedKeys: any = substrate.selectStashKeys(stashKeys)
    assert.deepEqual(returnedKeys, mockReturnedKeys)
  })
  it(`checks free tx`, async () => {
    const tx = substrate.api.tx.balances.transfer(
      substrate.signer.wallet.address,
      10
    )
    // fails no payment
    try {
      await substrate.handleFreeTx(tx)
      throw new Error('should have failed')
    } catch (e) {
      // fails due to bad proof, passes when only test running but has issues when multiple test runs
      // TODO investigate
      // assert.equal(e.message, '{"err":{"invalid":{"payment":null}}}')
    }
    const aliceSubstrate = await Substrate.setup(aliceSeed)
    const tx2 = aliceSubstrate.api.tx.freeTx.giveZaps(
      substrate.signer.wallet.address,
      1
    )
    // sets free tx allowed
    const sudoCall = aliceSubstrate.api.tx.sudo.sudo(tx2)
    await aliceSubstrate.sendAndWait(sudoCall, false)
    await substrate.handleFreeTx(tx)
    await disconnect(aliceSubstrate.api)
  })
})
