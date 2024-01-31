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
import { spawnSync } from 'child_process'
import { Transaction } from 'ethereumjs-tx'
import { preSign } from '../src/signing/adapters/eth'
import { ProgramData } from '../src/programs'
import { stringToU8a} from '@polkadot/util'
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

  // it('should handle registration, program management, and signing', async () => {
  //   jest.setTimeout(60000)

  //   const dummyProgram: any = readFileSync(
  //     './tests/testing-utils/template_barebones.wasm'
  //   )

  //   console.log('program deploy')

  //   const pointer = await entropy.programs.dev.deploy(dummyProgram)


  //   // Pre-registration check
  //   console.log("pre-registration check")
  //   const preRegistrationStatus = await entropy.isRegistered(
  //     charlieStashAddress
  //   )
  //   expect(preRegistrationStatus).toBeFalsy()
  //   const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
  //   expect(preStringifiedResponse).toBe('false')

  //   console.log('registration tests')
  //   await entropy.register({
  //     keyVisibility: 'Permissioned',
  //     freeTx: false,
  //     initialPrograms: [{ pointer: pointer, config: '0x' }],
  //     programModAccount: charlieStashAddress,
  //   })

  //   console.log('verifyingKey:', entropy.account.verifyingKey)
  //   expect(entropy.account.verifyingKey).toBeTruthy()
  //   expect(entropy.account.sigRequestKey.wallet.address).toBe(charlieStashAddress)
  //   expect(
  //     await entropy.registrationManager.checkRegistrationStatus(
  //       charlieStashAddress
  //     )
  //   ).toBeTruthy()

  //   // Post-registration check
  // console.log("post-registration check")

  //   const postRegistrationStatus = await entropy.isRegistered(
  //     charlieStashAddress
  //   )
  //   expect(postRegistrationStatus).toBeTruthy()

  //   const postStringifiedResponse = JSON.stringify(postRegistrationStatus)

  //   if (postStringifiedResponse === 'false') {
  //     console.log('is not registered')
  //   }

  //   expect(postStringifiedResponse).toBe('true')

  //   console.log("signing test")


    // const signature = await entropy.signTransaction({txParams: whitelisted_test_tx_req, type: 'eth'}) as string



  //   // encoding signature
  //   console.log("SIGGGG", signature)
  //   expect(signature.length).toBe(130)
  //   // await disconnect(charlieStashEntropy.substrate)
  // })

  it('should handle registration, program management, and signing', async () => {
    jest.setTimeout(60000)
  
    const basicTxProgram: any = readFileSync(
      './tests/testing-utils/template_basic_transaction.wasm'
    )

    console.log('program deploy')
  
    const pointer = await entropy.programs.dev.deploy(basicTxProgram)

    const allowlistConfig = {
      "allowlisted_addresses": [
          "772b9a9e8aa1c9db861c6611a82d251db4fac990"
      ]
  }

    const programData: ProgramData = {
      pointer: pointer,
      config: allowlistConfig,
    }
  
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
      initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
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

    // // loading second program

    //     const dummyProgram: any = readFileSync(
    //   './tests/testing-utils/template_barebones.wasm'
    // )

    // console.log('program deploy')

    // const newPointer = await entropy.programs.dev.deploy(dummyProgram)
    // console.log("new pointer", newPointer)
    // const secondProgramData: ProgramData = { 
    //   pointer: newPointer,
    //   config: ''
    // }
    // console.log('adding program to charlie')
    // const addSuccess = await entropy.programs.add(secondProgramData, charlieStashAddress)
    // console.log("ADD SUCCESS", addSuccess)
    // // getting charlie programs
    // const programs = await entropy.programs.get(charlieStashAddress)

    // console.log("CHARLIES PROGRAMS yay ", programs )
    // console.log("removing")
    // // removing charlie program barebones
    // await entropy.programs.remove(newPointer, charlieStashAddress )
    // const updatedRemovedPrograms = await entropy.programs.get(charlieStashAddress)
    // console.log("UPDATED REMOVED PROGRAM LIST ", updatedRemovedPrograms)


    console.log("signing test")
  
     const basicTx = {
      to: "0x772b9a9e8aa1c9db861c6611a82d251db4fac990",
      value: 1,
      chainId: 1,
      nonce: 1,
      data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
    }
  
    const signature = await entropy.signTransaction({txParams: basicTx, type: 'eth' }) as string
  

    // encoding signature
    console.log("SIGGGG", signature)
    expect(signature.length).toBe(130)
    // await disconnect(charlieStashEntropy.substrate)
  })
  
})

