import test from 'tape'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import Keyring from '../src/keys'
import { wasmGlobalsReady } from '../src'
// import { MnemonicSeedMaterial } from '../src/keys/types/json'
import { eveSeed } from './testing-utils/constants'

let testMnemonic: string
let derivationPath: string

async function testSetup() {
  await wasmGlobalsReady()
  testMnemonic = mnemonicGenerate()
  derivationPath = '//0'
}

test('Keys: create a keyring with seed', async (t) => {
  await testSetup()

  const keyring = new Keyring({ seed: eveSeed })

  t.true(Object.keys(keyring).includes('accounts'), 'has wallet')
  t.true(
    Object.keys(keyring.accounts.registration).includes('pair'),
    'has pair'
  )
  // it should generate valid Signer from seed
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')
  t.true(Object.keys(keyring.accounts.deviceKey).includes('pair'), 'has pair')

  t.end()
})

test('Keys: create a keyring with a mnemonic', async (t) => {
  t.skip('TODO: fix mnemonic functionality')

  await testSetup()

  /*
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
  */

  t.end()
})

const testConfig = {
  name: 'Charlie Stash',
  address: '5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT',
  data: {
    debug: true,
    seed: '0x66256c4e2f90e273bf387923a9a7860f2e9f47a1848d6263de512f7fb110fc08',
    admin: {
      seed: '0x66256c4e2f90e273bf387923a9a7860f2e9f47a1848d6263de512f7fb110fc08',
      path: '',
      address: '5Ck5SLSHYac6WFt5UZRSsdJjwmpSZq85fd5TRNAdZQVzEAPT',
    },
    registration: {
      seed: '0x66256c4e2f90e273bf387923a9a7860f2e9f47a1848d6263de512f7fb110fc08',
      path: '',
      type: 'registration',
      verifyingKeys: [
        '0x024f45b617279b6ff477b84ed4582f0ee8905b2f617de841efae3137dff3194afd',
        '0x02db05d9dc4483c8f0e6ee4863f3d9ada1036bbfd61638b9406e5f23c572a895ce',
      ],
      userContext: 'ADMIN_KEY',
    },
  },
}

test('Keys: keyring should persist the data passed through the constructor', async (t) => {
  await testSetup()
  const keyring = new Keyring(testConfig.data)
  t.true(Object.keys(keyring).includes('accounts'), 'has wallet')
  t.true(
    Object.keys(keyring.accounts.registration).includes('pair'),
    'has pair'
  )
  t.deepEqual(
    keyring.accounts.registration.verifyingKeys,
    testConfig.data.registration.verifyingKeys
  )

  t.end()
})
