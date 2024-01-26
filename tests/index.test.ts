import { readFileSync } from 'fs'
import { EntropyAccount } from '../src'
import Entropy from '../src'
import {
  sleep,
  disconnect,
  charlieStashSeed,
  charlieStashAddress,
  whitelisted_test_evm_address,
  whitelisted_test_tx_req,
} from './testing-utils'
import { Keyring } from '@polkadot/api'
import { getWallet } from '../src/keys'
import { mnemonicGenerate } from '@polkadot/util-crypto'
import { buf2hex } from '../src/utils'
import { spawnSync } from 'child_process'
import { Transaction } from 'ethereumjs-tx'
import { preSign } from '../src/signing/adapters/eth'

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

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)

    const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )

    console.log('program deploy')

    const hash = await entropy.programs.dev.deploy(dummyProgram)


    // Pre-registration check
    console.log("pre-registration check")
    const preRegistrationStatus = await entropy.isRegistered(
      charlieStashAddress
    )
    expect(preRegistrationStatus).toBeFalsy()
    const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
    expect(preStringifiedResponse).toBe('false')

    console.log('registration tests')
    await entropy.register({
      keyVisibility: 'Permissioned',
      freeTx: false,
      initialPrograms: [{ programPointer: hash, programConfig: '0x' }],
      programModAccount: charlieStashAddress,
    })

    console.log('verifyingKey:', entropy.account.verifyingKey)
    expect(entropy.account.verifyingKey).toBeTruthy()
    expect(entropy.account.sigRequestKey.wallet.address).toBe(charlieStashAddress)
    expect(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    ).toBeTruthy()

    // Post-registration check
  console.log("post-registration check")

    const postRegistrationStatus = await entropy.isRegistered(
      charlieStashAddress
    )
    expect(postRegistrationStatus).toBeTruthy()

    const postStringifiedResponse = JSON.stringify(postRegistrationStatus)

    if (postStringifiedResponse === 'false') {
      console.log('is not registered')
    }

    expect(postStringifiedResponse).toBe('true')
    // TODO: update these tests
    // let unauthorizedErrorCaught = false

    // const testMnemonic = mnemonicGenerate()
    // const keyring = new Keyring({ type: 'sr25519' })
    // const keypair = keyring.addFromUri(testMnemonic)

    // const derivedAddress = keypair.address

    // console.log("not authorized to set program test")


    // try {
    //   await entropy.programs.set(dummyProgram, derivedAddress)
    //   expect(
    //     'derivedAddress should not be authorized to set the program for Charlie'
    //   )
    // } catch (error) {
    //   if (
    //     error.message.includes(
    //       "Program modification account doesn't have permission to modify this program"
    //     )
    //   ) {
    //     unauthorizedErrorCaught = true
    //   } else {
    //     throw error
    //   }
    // }

    // expect(unauthorizedErrorCaught).toBeTruthy()

    console.log("signing test")


    const signature = await entropy.signTransaction({txParams: whitelisted_test_tx_req, type: 'eth'}) as string



    // encoding signature
    console.log("SIGGGG", signature)
    expect(signature.length).toBe(130)
    // await disconnect(charlieStashEntropy.substrate)
  })
})
