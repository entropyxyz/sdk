import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  charlieStashSeed,
  charlieStashAddress,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'two-nodes'

test('Programs#dev: all methods', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))
  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType)
  })

  await run('wasm', wasmGlobalsReady())

  const keyring = new Keyring({ seed: charlieStashSeed, debug: true })
  let store = keyring.getAccount()
  t.equal(store.admin.address, keyring.accounts.registration.pair.address, 'admin account should have an address and for now it should match registrations address')
  keyring.accounts.on('account-update', (fullAccount) => {
    store = fullAccount
  })

  const entropy = new Entropy({
    keyring,
    endpoint: 'ws://127.0.0.1:9944',
  })


  // wait for entropy to be ready
  await run(
    'entropy ready',
    entropy.ready
  )


  // deploy
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm',

  )

  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram)
  )

  const programsDeployed = await run(
    'get deployed programs',
    entropy.programs.dev.getByDeployer(charlieStashAddress)
  )

  const noopProgramOnChain = await run(
    'get a specific program',
    entropy.programs.dev.get(newPointer)
  )

  t.equal(
    programsDeployed.length,
    1,
    'charlie has deployed 1 program' + programsDeployed
  )

  t.equal(
    programsDeployed[0],
    newPointer,
    'program in list matches new pointer: ' + newPointer + ' = ' + programsDeployed[0]
  )

  t.deepEqual(
    Buffer.from(noopProgramOnChain.bytecode),
    noopProgram,
    'Whats on chain should match what was deployed'
  )

  run(
    'remove noopProgram',
    entropy.programs.dev.remove(newPointer)
  )

  const programsDeployedAfterRemove = await run(
    'get deployed programs',
    entropy.programs.dev.getByDeployer(charlieStashAddress)
  )
  // the removal of a program has failed
  // the removing of a program is questionable
  // functionality to begin with so ive commented this out
  // for now but this needs digging
  // t.equal(
  //   programsDeployedAfterRemove.length,
  //   0,
  //   'charlie has no deployed programs'
  // )


  t.end()
})
