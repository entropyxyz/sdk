export const count = 1

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

const networkNeeds = true

const networkType = 'two-nodes'

export function runner (suite) {
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
    // first test
    suite.notOk(preRegistrationStatus)
    // second test
    suite.is(JSON.stringify(preRegistrationStatus), 'false')

    await entropy.register({
      keyVisibility: 'Permissioned',
      freeTx: false,
      // initialPrograms: [{ pointer: programData.pointer, config: programData.config }],
      initialPrograms: [programData],
      programModAccount: charlieStashAddress,
    })
    // third test
    suite.ok(entropy.account.verifyingKey)
    // fourth test
    expect(entropy.account.sigRequestKey.wallet.address).toBe(
      charlieStashAddress
    )
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
    expect(signature.length).toBe(228)
    // await disconnect(charlieStashEntropy.substrate)
}