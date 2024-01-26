import { readFileSync } from 'fs'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
} from './testing-utils'
import { Keyring } from '@polkadot/api'
import { getWallet } from '../src/keys'
import { EntropyAccount } from '../src'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { buf2hex } from '../src/utils'
import { spawnSync } from 'child_process'

describe('Programs Tests', () => {
  let entropy: Entropy

  beforeAll(async () => {
    jest.setTimeout(300000) // Give us five minutes to spin up.
    try {
      spawnSync(
        'docker',
        ['compose', '--file', 'tests/docker-compose.yaml', 'up', '--detach'],
        { shell: true, stdio: 'inherit' } // Use shell's search path.
      )
    } catch (e) {
      console.error('Error in beforeAll: ', e.message)
    }

    const signer = await getWallet(charlieStashSeed)
    const entropyAccount: EntropyAccount = {
      sigRequestKey: signer,
      programModKey: signer,
      programDeployKey: signer
    }

    await sleep(30000)
    entropy = new Entropy({ account: entropyAccount})
    await entropy.ready
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

  it('should handle programs', async () => {
    jest.setTimeout(60000)


    const dummyProgram = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    const hash = await entropy.programs.dev.set(dummyProgram)
    const fetchedProgram = await entropy.programs.dev.get(hash)
    const trimmedBuffer = fetchedProgram.slice(1)
    expect(buf2hex(trimmedBuffer)).toEqual(buf2hex(dummyProgram))
  })
})
