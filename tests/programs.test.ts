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
      programModKey: signer
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

    const isRegistered = await entropy.isRegistered(charlieStashAddress)
    if (!isRegistered) {
      // Test registration

      await entropy.register({
        programModAccount: charlieStashAddress,
        keyVisibility: 'Permissioned',
        freeTx: false,
        initialProgram: '0x',
      })

      return await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    }

    // // create key to check authorized

    const testMnemonic = mnemonicGenerate()
    const keyring = new Keyring({ type: 'sr25519' })
    const keypair = keyring.addFromUri(testMnemonic)

    const derivedAddress = keypair.address

    const dummyProgram = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )
    await entropy.programs.set(dummyProgram, charlieStashAddress)
    const fetchedProgram = await entropy.programs.get(charlieStashAddress)
    const trimmedBuffer = fetchedProgram.slice(1)
    expect(buf2hex(trimmedBuffer)).toEqual(buf2hex(dummyProgram))

    try {
      await entropy.programs.set(dummyProgram, derivedAddress)
      fail('Expected an error for unauthorized program set')
    } catch (error) {
      expect(error.message).toContain("doesn't have permission")
    }
  })
})
