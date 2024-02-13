import { readFileSync } from 'fs'
import { EntropyAccount } from '../src'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
} from './testing-utils'
import { getWallet } from '../src/keys'
import { spawnSync } from 'child_process'

describe('Core Tests', () => {
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
      programDeployKey: signer,
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


  it('should handle allow for instantiation with no accounts', async () => {
    entropy = new Entropy({})
    await entropy.ready
  })
  it('should handle allow for instantiation with only programDeployKey', async () => {
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {programDeployKey: signer}})

    await entropy.ready
  })
  it('allow for instantiation with only sigRequestKey', async () => {
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {sigRequestKey: signer}})
    await entropy.ready
  })
  it('allow for instantiation with only sigRequestKey && programModKey as address', async () => {
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {sigRequestKey: signer, programModKey: charlieStashAddress}})
    expect(() => {
      entropy.programs.set
    }).toThrow()
    await entropy.ready
  })
  
})

