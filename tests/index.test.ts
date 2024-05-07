import test from 'tape'
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
import { execFileSync } from 'child_process'
import { ProgramData } from '../src/programs'
import * as util from '@polkadot/util'

test('Core Tests', (t) => {
  let entropy: Entropy

  t.test('beforeAll', async (t) => {
    const timeout = setTimeout(() => {
      throw Error('failed to spin up')
    }, 300000)

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

    clearTimeout(timeout)
    t.end()
  })

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)

    const basicTxProgram: any = readFileSync(
      './tests/testing-utils/template_basic_transaction.wasm'
    )

    const pointer = await entropy.programs.dev.deploy(basicTxProgram)
    const config = `
    {
        "allowlisted_addresses": [
            "772b9a9e8aa1c9db861c6611a82d251db4fac990"
        ]
    }
`
    // convert to bytes

    const encoder = new TextEncoder()
    const byteArray = encoder.encode(config)

    // convert u8a to hex
    const programConfig = util.u8aToHex(new Uint8Array(byteArray))

    const programData: ProgramData = {
      programPointer: pointer,
      programConfig: programConfig,
    }

    // Pre-registration check
    const preRegistrationStatus = await entropy.isRegistered(
      charlieStashAddress
    )

    t.false(preRegistrationStatus)
    const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
    t.false(preStringifiedResponse)

    await entropy.register({
      keyVisibility: 'Permissioned',
      freeTx: false,
      // initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
      initialPrograms: [programData],
      programModAccount: charlieStashAddress,
    })

    t.true(entropy.account.verifyingKey)
    t.equal(entropy.account.sigRequestKey.wallet.address, charlieStashAddress)
    t.true(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    )

    // Post-registration check

    const postRegistrationStatus = await entropy.isRegistered(
      charlieStashAddress
    )
    t.true(postRegistrationStatus)

    const postStringifiedResponse = JSON.stringify(postRegistrationStatus)

    if (postStringifiedResponse === 'false') {
      console.log('is not registered')
    }

    t.equal(postStringifiedResponse, 'true')

    //  loading second program

    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )

    const newPointer = await entropy.programs.dev.deploy(dummyProgram)
    const secondProgramData: ProgramData = {
      programPointer: newPointer,
      programConfig: '',
    }
    await entropy.programs.add(secondProgramData, charlieStashAddress)
    // getting charlie programs
    const programs = await entropy.programs.get(charlieStashAddress)

    console.log('CHARLIES PROGRAMS', programs)
    // removing charlie program barebones
    await entropy.programs.remove(newPointer, charlieStashAddress)
    const updatedRemovedPrograms = await entropy.programs.get(
      charlieStashAddress
    )

    const basicTx = {
      to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
      value: 1,
      chainId: 1,
      nonce: 1,
      data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
    }

    const signature = (await entropy.signTransaction({
      txParams: basicTx,
      type: 'eth',
    })) as string

    // encoding signature
    console.log('SIGGGG', signature)
    t.equal(signature.length, 228)
    // await disconnect(charlieStashEntropy.substrate)

    t.end()
  })

  t.test('afterAll', async (t) => {
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
    t.end()
  })
})
