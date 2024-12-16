import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'
import * as util from '@polkadot/util'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  eveSeed,
  eveAddress,
  spinNetworkDown,
} from './testing-utils'
import { ProgramInstance } from '../src/programs'
import { MsgParams } from '../src/signing'

const networkType = 'four-nodes'

const msg = Buffer.from('Hello world: signature from entropy!').toString('hex')

test('End To End', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  await run('wasm', wasmGlobalsReady())

  const keyring = new Keyring({ seed: eveSeed, debug: true })
  let store = keyring.getAccount()
  t.equal(store.admin.address, keyring.accounts.registration.pair.address, 'admin account should have an address and for now it should match registrations address')
  keyring.accounts.on('account-update', (fullAccount) => {
    store = fullAccount
  })

  t.equal(
    keyring.accounts.registration.address,
    eveAddress,
    'got right address'
  )

  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await run(
    'entropy ready',
    entropy.ready
  )
  await run('jump-start network', jumpStartNetwork(entropy))

  /* deploy */
  // const bareBones: any = readFileSync(
  //   './tests/testing-utils/template_barebones.wasm'
  // )
  // t.equal(typeof bareBones.toString(), 'string', 'got basic program')

  // QUESTION: how to launch substrate node with a particular address pre-funded

  // const pointer = await run(
  //   'deploy program',
  //   entropy.programs.dev.deploy(bareBones)
  // )
  // t.equal(typeof pointer, 'string', 'valid pointer')

  // register
  let verifyingKeyFromRegistration
  const emitterTest = run(
    'keyring.accounts.once#account-update',
    new Promise((res, reject) => {
      // TODO remove event listener if it hangs
      keyring.accounts.on('account-update', (fullAccountView) => {
        if (!verifyingKeyFromRegistration) return
        if (!fullAccountView.admin) reject('no admin account')
        if (!fullAccountView.registration) reject('no registration account')
        if (!fullAccountView.deviceKey) reject('no deviceKey account')
        if (!fullAccountView.registration.verifyingKeys)
          reject('no registration.verifyingKeys ')
        if (!fullAccountView.registration.verifyingKeys[0])
          reject(
            'no registration.verifyingKeys[0] this means their were no keys added'
          )
        const last = fullAccountView.registration.verifyingKeys.pop()
        if (!last === verifyingKeyFromRegistration)
          reject('verifyingKey returned in registration does not match')
        if (!last === fullAccountView.deviceKey.verifyingKeys[0])
          reject(
            'verifyingKey on registration does not match device keys verifyingKeys[0]'
          )
        return res(fullAccountView)
      })
    })
  )
  verifyingKeyFromRegistration = await run('register', entropy.register())

  t.equal(
    verifyingKeyFromRegistration,
    entropy.keyring.accounts.registration.verifyingKeys[0],
    'verifyingKeys match after registration'
  )
  // tests the once function as well as what is
  // considered to be necessary changes to the full account after emitting
  await emitterTest

  //
  // sign some data
  //

  // NEED PRE-REGISTRATION TEST
  // const preRegistrationStatusCheck = await run(
  //   'checkRegistrationStatus',
  //   entropy.substrate.query.registry.registered(verifyingKey)
  //   // entropy.registrationManager.checkRegistrationStatus(eveAddress)
  // )
  // t.ok(preRegistrationStatusCheck, 'preRegistrationStatusCheck ...') // TODO: better check

  // Use the verifyingKey from ProgramManager

  const verifyingKey = entropy.programs.verifyingKey
  t.ok(verifyingKey, 'verifyingKey exists')

  const registrationStatus = await run(
    'check registration',
    entropy.substrate.query.registry.registered(verifyingKey)
  )

  t.ok(registrationStatus, 'Verifying key is registered')

  //  loading second program
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm'
  )

  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram)
  )

  const noopProgramInstance: ProgramInstance = {
    program_pointer: newPointer,
    program_config: '',
  }

  console.debug('verifyingKey', verifyingKey)
  const programsBeforeAdd = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )

  t.equal(
    programsBeforeAdd.length,
    1,
    'eve has 1 programs' + JSON.stringify(programsBeforeAdd)
  )

  await run('add program', entropy.programs.add(noopProgramInstance))
  // getting eve programs
  const programsAfterAdd = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )

  t.equal(programsAfterAdd.length, 2, 'eve has 2 programs')

  const msgParam: MsgParams = { msg }

  const signatureDataFromAdapter = await run(
    'signWithAdaptersInOrder',
    entropy.signWithAdaptersInOrder({
      msg: msgParam,
      order: ['deviceKeyProxy', 'noop'],
    })
  )

  t.equal(
    signatureDataFromAdapter.signature.length,
    132,
    'got a good sig from adapter'
  )

  // removing deviceKey
  const deviceKeyProxyPointer =
    '0x0000000000000000000000000000000000000000000000000000000000000000'
  await run(
    'remove DeviceKeyProxy program',
    entropy.programs.remove(deviceKeyProxyPointer, verifyingKey)
  )

  const programsAftreRemoveDefault = await run(
    'get programs',
    entropy.programs.get(verifyingKey)
  )
  t.equal(programsAftreRemoveDefault.length, 1, 'eve has 1 program')
  const signatureData = await run(
    'sign',
    entropy.sign({
      hexMessage: msg,
      hash: 'sha3',
    })
  )
  t.equal(signatureData.signature.length, 132, 'got a good sig')

  t.end()
})
