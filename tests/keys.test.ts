import test from 'tape'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { getWallet, mnemonicGenOrDerive } from '../src/keys'

import { charlieStashSeed } from './testing-utils'

let testMnemonic: string
// let derivationPath: string

async function testSetup () {
  testMnemonic = mnemonicGenerate()
  // derivationPath = '//0'
}

test('Keys: getWallet', async (t) => {
  t.plan(2)
  await testSetup()
  // it should generate valid Signer from seed
  const walletSigner = await getWallet(charlieStashSeed)
  t.true(Object.keys(walletSigner).includes('wallet'), 'has wallet')
  t.true(Object.keys(walletSigner).includes('pair'), 'has pair')
})

test('Keys: generateKeysFromMnemonic', async (t) => {
  t.plan(2)
  await testSetup()
  // it should generate valid Signer from mnemonic
  const mnemonicSigner = await mnemonicGenOrDerive(testMnemonic)
  t.true(Object.keys(mnemonicSigner).includes('wallet'), 'has wallet')
  t.true(Object.keys(mnemonicSigner).includes('pair'), 'has pair')
})
