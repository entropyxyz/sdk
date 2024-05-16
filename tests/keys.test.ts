import test from 'tape'
import Keyring from '../src/keys'
import { HexSeedMaterial, MnemonicSeedMaterial } from '../src/keys/types/json'
import { generateMnemonic, seedFromMnemonic } from '../src/keys/utils'
import { charlieStashSeed } from './testing-utils/constants'

let testMnemonic: string
let derivationPath: string

async function testSetup() {
  testMnemonic = generateMnemonic()
  derivationPath = '//0'
}

test('Keys: create a keyring with seed', async (t) => {
  t.plan(2)
  await testSetup()
  const keyring = new Keyring({ seed: charlieStashSeed })

  t.true(Object.keys(keyring).includes('accounts'), 'has wallet')
  t.true(
    Object.keys(keyring.accounts.registration).includes('pair'),
    'has pair'
  )
  // it should generate valid Signer from seed
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')
})

test('Keys: create a keyring with a mnemonic', async (t) => {
  t.plan(2)
  await testSetup()
  // it should generate valid Signer from mnemonic
  const keyring = new Keyring({
    mnemonic: testMnemonic,
  } as MnemonicSeedMaterial)

  t.true(Object.keys(keyring).includes('accounts'), 'has wallet')
  t.true(
    Object.keys(keyring.accounts.registration).includes('pair'),
    'has pair'
  )
  // it should generate valid Signer from seed
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')
})
