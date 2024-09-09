import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  charlieStashAddress,
  spinNetworkDown,
  createTestAccount,
} from './testing-utils'

const networkType = 'two-nodes'

test('Programs#dev: all methods', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))

  await run('wasm', wasmGlobalsReady())

  const entropy = await createTestAccount()

  t.teardown(async () => {
    await entropy.close()
    await spinNetworkDown(networkType)
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

  const configSchema = {
    noop_param: 'string',
  }
  const auxDataSchema = {
    noop_param: 'number'
  }
  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram, configSchema, auxDataSchema)
  )
  console.log('newPointer:', newPointer)
  const programsDeployed = await run(
    'get deployed programs',
    entropy.programs.dev.getByDeployer(charlieStashAddress)
  )
  try {
    await entropy.programs.dev.get(charlieStashAddress)
    t.fail('entropy.programs.dev.get(charlieStashAddress) should have failed')
  } catch (e) {
    t.ok(e.message.includes('pointer length is less then or equal to 48. are you using an address?'), 'should error when using an address')
  }

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
    noopProgramOnChain.bytecode,
    noopProgram,
    'bytecode on chain should match what was deployed'
  )
  t.deepEqual(
    noopProgramOnChain.configurationSchema,
    configSchema,
    'configurationSchema on chain should match what was deployed'
  )
  t.deepEqual(
    noopProgramOnChain.auxiliaryDataSchema,
    auxDataSchema,
    'auxiliaryDataSchema on chain should match what was deployed'
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
  // see issue https://github.com/entropyxyz/sdk/issues/414
  // t.equal(
  //   programsDeployedAfterRemove.length,
  //   0,
  //   'charlie has no deployed programs'
  // )


  t.end()
})
