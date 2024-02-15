process.env.NODE_ENV = 'production'

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
import * as util from '@polkadot/util'

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

    expect(preRegistrationStatus).toBeFalsy()
    const preStringifiedResponse = JSON.stringify(preRegistrationStatus)
    expect(preStringifiedResponse).toBe('false')
  



    await entropy.register({
      keyVisibility: 'Permissioned',
      freeTx: false,
      // initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
      initialPrograms: [programData],
      programModAccount: charlieStashAddress,
    })
  
    expect(entropy.account.verifyingKey).toBeTruthy()
    expect(entropy.account.sigRequestKey.wallet.address).toBe(charlieStashAddress)
    expect(
      await entropy.registrationManager.checkRegistrationStatus(
        charlieStashAddress
      )
    ).toBeTruthy()
  
    // Post-registration check
  
    const postRegistrationStatus = await entropy.isRegistered(
      charlieStashAddress
    )
    expect(postRegistrationStatus).toBeTruthy()
  
    const postStringifiedResponse = JSON.stringify(postRegistrationStatus)
  
    if (postStringifiedResponse === 'false') {
      console.log('is not registered')
    }
  
    expect(postStringifiedResponse).toBe('true')

    //  loading second program

        const dummyProgram: any = readFileSync(
      './tests/testing-utils/template_barebones.wasm'
    )


    const newPointer = await entropy.programs.dev.deploy(dummyProgram)
    const secondProgramData: ProgramData = { 
      programPointer: newPointer,
      programConfig: ''
    }
   await entropy.programs.add(secondProgramData, charlieStashAddress)
    // getting charlie programs
    const programs = await entropy.programs.get(charlieStashAddress)

    console.log("CHARLIES PROGRAMS", programs )
    // removing charlie program barebones
    await entropy.programs.remove(newPointer, charlieStashAddress )
    const updatedRemovedPrograms = await entropy.programs.get(charlieStashAddress)
  
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
    expect(signature.length).toBe(228)
    await disconnect(entropy.substrate)
    // await disconnect(charlieStashEntropy.substrate)
  })
  
  it('should handle allow for instantiation with no accounts', async () => {
    console.log('should handle allow for instantiation with no accounts')
    entropy = new Entropy({})
    expect(await entropy.ready).toBeTruthy()
    await disconnect(entropy.substrate)
  })
  it('should handle allow for instantiation with only programDeployKey', async () => {
    console.log('should handle allow for instantiation with only programDeployKey')
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {programDeployKey: signer}})

    await entropy.ready
    expect(entropy.account.sigRequestKey.wallet.address).toEqual(charlieStashAddress)
    await disconnect(entropy.substrate)
  })
  it('allow for instantiation with only sigRequestKey', async () => {
    console.log('allow for instantiation with only sigRequestKey')
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {sigRequestKey: signer}})
    await entropy.ready
    await disconnect(entropy.substrate)
  })
  it('allow for instantiation with only sigRequestKey && programModKey as address', async () => {
    console.log('allow for instantiation with only sigRequestKey && programModKey as address')
    const signer = await getWallet(charlieStashSeed)
    entropy = new Entropy({account: {sigRequestKey: signer, programModKey: charlieStashAddress}})
    expect(entropy.programs.set).toThrow('entropy was not Initialized with valid key pairs for this operation')

    await entropy.ready
    await disconnect(entropy.substrate)
  })

})

