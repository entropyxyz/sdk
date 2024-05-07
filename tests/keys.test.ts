import { sleep, charlieStashSeed } from './testing-utils'
import { mnemonicGenerate } from '@polkadot/util-crypto'

import { getWallet, mnemonicGenOrDerive } from '../src/keys'
import tape from 'tape'

export const count = 4
let testMnemonic: string
let derivationPath: string
async function testSetup() {
  try {
    console.log('starting key tests')
  } catch (e) {
    console.error('Error in beforeAll: ', e.message)
  }

  await sleep(30000)

  testMnemonic = mnemonicGenerate()
  derivationPath = '//0'
}

function testCleanup() {
  try {
    ;('finished')
  } catch (e) {
    console.error('Error in afterAll: ', e.message)
  }
}

tape('Keys Test: getWallet', async (t) => {
  t.plan(2)
  await testSetup()
  // it should generate valid Signer from seed
  const walletSigner = await getWallet(charlieStashSeed)
  // test 1
  t.ok(Object.keys(walletSigner).includes('wallet'))
  // test 2
  t.ok(Object.keys(walletSigner).includes('pair'))

  testCleanup()
  // suite.end();
})

tape('Keys Test: generateKeysFromMnemonic', async (t) => {
  t.plan(2)
  await testSetup()
  // it should generate valid Signer from mnemonic
  const mnemonicSigner = await mnemonicGenOrDerive(testMnemonic)
  // test 1
  t.ok(Object.keys(mnemonicSigner).includes('wallet'))
  // test 2
  t.ok(Object.keys(mnemonicSigner).includes('pair'))
  testCleanup()
  // suite.end();
})
