import { readFileSync } from 'fs'
import { SignatureLike } from '@ethersproject/bytes'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieSeed,
  charlieAddress,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_tx_req,
  non_whitelisted_test_tx_req,
  whitelisted_test_constraints,
} from './testing-utils'
import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto'
import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'
import { buf2hex, stripHexPrefix } from '../src/utils'
import { spawnSync } from 'child_process'
import {
  generateEntropyAccountFromSeed,
  generateEntropyAccountFromSeeds,
  generateKeysFromMnemonic,
  generateKeysFromPrivateKey,
  deriveNewKeysFromMnemonic
} from '../src/keys'

describe('Core Tests', () => {
  let entropy: Entropy
  let testMnemonic: string
  let derivationPath: string

  beforeAll(async () => {
    jest.setTimeout(300000)
    try {
      spawnSync(
        "docker",
        [ "compose", "--file", "tests/docker-compose.yaml", "up", "--detach" ],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    await sleep(30000) 
    entropy = new Entropy({ seed: charlieStashSeed })
    await entropy.ready

    testMnemonic = mnemonicGenerate()
    derivationPath = '//0' 
  })

  afterAll(async () => {
    try {
      await disconnect(entropy.substrate)
      spawnSync(
        "docker",
        [ "compose", "--file", "tests/docker-compose.yaml", "down" ],
        { shell: true, stdio: 'inherit' }
      )
      spawnSync(
        "docker",
        [ "compose", "--file", "tests/docker-compose.yaml", "logs" ],
        { shell: true, stdio: 'inherit' }
      )
    } catch (e) {
        console.error('Error in afterAll: ', e.message)
    }
  })

  // Add your new tests here
  describe('generateEntropyAccountFromSeed', () => {
    it('should generate valid EntropyAccount from seed', async () => {
      const entropyAccount = await generateEntropyAccountFromSeed(testMnemonic)
      expect(entropyAccount).toHaveProperty('sigRequestKeyPair')
      expect(entropyAccount.sigRequestKeyPair).toHaveProperty('publicKey')
      expect(entropyAccount.sigRequestKeyPair).toHaveProperty('secretKey')
    })
  })

  describe('generateEntropyAccountFromSeeds', () => {
    it('should generate valid EntropyAccount from two seeds', async () => {
      const sigSeed = mnemonicGenerate()
      const progSeed = mnemonicGenerate()
      const entropyAccount = await generateEntropyAccountFromSeeds(sigSeed, progSeed)
      expect(entropyAccount).toHaveProperty('sigRequestKeyPair')
      expect(entropyAccount).toHaveProperty('programModificationKeyPair')
    })
  })

  describe('generateKeysFromPrivateKey', () => {
    it('should generate valid Signer from private key', async () => {
      const mnemonic = mnemonicGenerate()
      const miniSecret = mnemonicToMiniSecret(mnemonic)
      const privateKeyHex = Buffer.from(miniSecret).toString('hex')
      const signer = await generateKeysFromPrivateKey(privateKeyHex)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })

  describe('generateKeysFromMnemonic', () => {
    it('should generate valid Signer from mnemonic', async () => {
      const signer = await generateKeysFromMnemonic(testMnemonic)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })

  describe('deriveNewKeysFromMnemonic', () => {
    it('should generate new keys from mnemonic and derivation path', async () => {
      const signer = await deriveNewKeysFromMnemonic(testMnemonic, derivationPath)
      expect(signer).toHaveProperty('wallet')
      expect(signer).toHaveProperty('pair')
    })
  })
})
