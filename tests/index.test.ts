import test from 'tape'
import { readFileSync } from 'fs'
import * as util from '@polkadot/util'
import Entropy, { EntropyAccount } from '../src'
import { ProgramData } from '../src/programs'

import {
  spinNetworkUp,
  spinNetworkDown,
  createTestAccount,
  charlieStashAddress,
} from './testing-utils'

const networkType = 'two-nodes'

test('Core Tests', (t) => {
  let entropy: Entropy

  t.test('beforeAll', async (t) => {
    const timeout = setTimeout(() => {
      throw Error('failed to spin up')
    }, 300000)

    try {
      await spinNetworkUp(networkType)
      entropy = await createTestAccount(entropy)
    } catch (err) {
      t.error(err, 'setup succeeded')
    }
    t.pass('setup succeeded')

    clearTimeout(timeout)
    t.end()
  })

  t.test(
    'should handle registration, program management, and signing',
    async () => {
      const timeout = setTimeout(() => {
        throw Error('failed to spin up')
      }, 300000)

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
        charlieStashAddress // TODO: use entropy.account.address?
      )
      t.equal(JSON.stringify(preRegistrationStatus), 'false')

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

      t.equal(programs.length, 2, 'charlie has 2 programs')
      // console.log('CHARLIES PROGRAMS', programs)

      // removing charlie program barebones
      await entropy.programs.remove(newPointer, charlieStashAddress)
      const updatedRemovedPrograms = await entropy.programs.get(
        charlieStashAddress
      )
      t.equal(updatedRemovedPrograms.length, 1, 'charlie can remove a program')

      const basicTx = {
        to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
        value: 1,
        chainId: 1,
        nonce: 1,
        data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
      }

      await entropy
        .signTransaction({
          txParams: basicTx,
          type: 'eth',
        })
        .then((signature: string) => {
          t.equal(signature.length, 228, 'signature is good')
        })
        .catch((err) => t.error(err, 'signature is good'))

      clearTimeout(timeout)
      t.end()
    }
  )

  t.test('afterAll', async (t) => {
    await spinNetworkDown(networkType, entropy).catch((err) =>
      t.error(err, 'teardown')
    )
  })
})
