import { execFileSync } from 'child_process'
import { getWallet } from '../src/keys'
import { charlieStashSeed, disconnect, sleep } from './testing-utils'
import Entropy, { EntropyAccount } from '../src'

const tape = require('tape')
let entropy: Entropy
async function testSetup() {
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
}

async function testCleanup() {
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
}

tape('should return hello', (t) => {
  testSetup()
  t.plan(2)
  // before all
  const string = 'Hello'
  const expected = 'Hello'

  t.ok(string)
  t.deepEqual(string, expected)

  // after all
  testCleanup()
  t.end()
})
