import { sleep, charlieStashSeed } from './testing-utils'
import { mnemonicGenerate } from '@polkadot/util-crypto'

import { getWallet, mnemonicGenOrDerive } from '../src/keys'

describe('Keys Tests', () => {
  let testMnemonic: string
  let derivationPath: string

  beforeAll(async () => {
    try {
      console.log('starting key tests')
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    await sleep(30000)

    testMnemonic = mnemonicGenerate()
    derivationPath = '//0'
  })

  afterAll(async () => {
    try {
      ('finished')
    } catch (e) {
      console.error('Error in afterAll: ', e.message)
    }
  })

  describe('getWallet', () => {
    it('should generate valid Signer from seed', async () => {
      const signer = await getWallet(charlieStashSeed)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })

  describe('generateKeysFromMnemonic', () => {
    it('should generate valid Signer from mnemonic', async () => {
      const signer = await mnemonicGenOrDerive(testMnemonic)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })
})
