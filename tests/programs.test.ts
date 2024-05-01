import { readFileSync } from 'fs'
import { execFileSync } from 'child_process'
import Entropy from '../src'
import { sleep, disconnect, charlieStashSeed } from './testing-utils'
import { getWallet } from '../src/keys'
import { EntropyAccount } from '../src'
import { buf2hex } from '../src/utils'

describe('Programs Tests', () => {
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

  it('should handle programs', async () => {
    jest.setTimeout(60000)

    const dummyProgram = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )

    const pointer = await entropy.programs.dev.deploy(dummyProgram)
    // @ts-ignore next line
    const fetchedProgram = await entropy.programs.dev.get(pointer)
    // @ts-ignore next line
    expect(buf2hex(fetchedProgram.bytecode)).toEqual(buf2hex(dummyProgram))
  })
})
