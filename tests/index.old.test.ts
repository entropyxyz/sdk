import { readFileSync } from 'fs'
import { EntropyAccount } from '../src'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_evm_address,
} from './testing-utils'
import { Keyring } from '@polkadot/api'
import { getWallet } from '../src/keys'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { buf2hex } from '../src/utils'
import { execFileSync } from 'child_process'
import { Transaction } from 'ethereumjs-tx'
import { preSign } from '../src/signing/adapters/eth'
import { ProgramData } from '../src/programs'
import { stringToU8a } from '@polkadot/util'
import * as util from '@polkadot/util'

describe('Core Tests', () => {
  let entropy: Entropy

  beforeAll(async () => {
    jest.setTimeout(300000) // Give us five minutes to spin up.
    try {
      execFileSync(
        'dev/bin/spin-up.sh',
        ['two-nodes'],
        { shell: true, cwd: process.cwd(), stdio: 'inherit' } // Use shell's search path.
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    const signer = await getWallet(charlieStashSeed)

    const entropyAccount: EntropyAccount = {
      sigRequestKey: signer,
      programModKey: signer,
      programDeployKey: signer,
    }

    await sleep(30000)
    entropy = new Entropy({ account: entropyAccount })
    await entropy.ready
  })

  afterAll(async () => {
    try {
      await disconnect(entropy.substrate)
      execFileSync('dev/bin/spin-down.sh', ['two-nodes'], {
        shell: true,
        cwd: process.cwd(),
        stdio: 'inherit',
      })
    } catch (e) {
      console.error('Error in afterAll: ', e.message)
    }
  })

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)

  })
})
