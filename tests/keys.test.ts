import Entropy from '../src'
import { sleep, disconnect, charlieStashSeed } from './testing-utils'
import { mnemonicGenerate } from '@polkadot/util-crypto'

import { spawnSync } from 'child_process'
import {
  getWallet,
  generateFromMnemonic,
  deriveFromMnemonic,
} from '../src/keys'

describe('Keys Tests', () => {
  let entropy: Entropy
  let testMnemonic: string
  let derivationPath: string

  beforeAll(async () => {
    jest.setTimeout(300000)
    try {
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    await sleep(30000)

    const keyOptions = {
      seed: charlieStashSeed,
    }

    entropy = new Entropy({ keyOptions: keyOptions })
    await entropy.ready

    testMnemonic = mnemonicGenerate()
    derivationPath = '//0'
  })

  afterAll(async () => {
    try {
      await disconnect(entropy.substrate)
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'down'],
        { shell: true, stdio: 'inherit' }
      )
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'logs'],
        { shell: true, stdio: 'inherit' }
      )
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
      const signer = await generateFromMnemonic(testMnemonic)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })

  describe('deriveNewKeysFromMnemonic', () => {
    it('should generate new keys from mnemonic and derivation path', async () => {
      const signer = await deriveFromMnemonic(testMnemonic, derivationPath)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })
})
