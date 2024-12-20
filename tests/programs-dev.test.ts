import test from 'tape'
import { readFileSync } from 'fs'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  eveAddress,
  spinNetworkDown,
  createTestAccount,
} from './testing-utils'

const networkType = 'four-nodes'

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
  await run('jump-start network', jumpStartNetwork(entropy))

  const programNotOnChain = await run(
    'get a program not on chain',
    entropy.programs.dev.get('0x6c8228950ca8dfb557d42ce11643c67ba5a3e5cee3ce7232808ea7477b846bcb')
  )
  t.equal(programNotOnChain, null, 'get a program not on chain should be null')

  // deploy
  const noopProgram: any = readFileSync(
    './tests/testing-utils/program_noop.wasm',

  )

  const configSchema = {
    type: 'object',
    properties: {
      noop_param: { type: 'string' }
    }
  }
  const auxDataSchema = {
    type: 'object',
    properties: {
      noop_param: { type: 'number' }
    }
  }
  const newPointer = await run(
    'deploy',
    entropy.programs.dev.deploy(noopProgram, configSchema, auxDataSchema)
  )
  const programsDeployed = await run(
    'get deployed programs',
    entropy.programs.dev.getByDeployer(entropy.keyring.accounts.programDev.address)
  )
  t.deepEqual(
    programsDeployed,
    [newPointer],
    'eve has 1 program deployed'
  )
  
  // Helpful error for old usage
  try {
    await entropy.programs.dev.get(entropy.keyring.accounts.programDev.address)
    t.fail('entropy.programs.dev.get(entropy.keyring.accounts.programDev.address) should have failed')
  } catch (e) {
    t.ok(e.message.includes('pointer length is less then or equal to 48. are you using an address?'), 'should error when using an address')
  }

  const noopProgramOnChain = await run(
    'get a specific program',
    entropy.programs.dev.get(newPointer)
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

  await run(
    'remove noopProgram',
    entropy.programs.dev.remove(newPointer)
  )

  const programsDeployedAfterRemove = await run(
    'get deployed programs',
    entropy.programs.dev.getByDeployer(entropy.keyring.accounts.programDev.address)
  )
  // the removal of a program has failed
  // the removing of a program is questionable
  // functionality to begin with so ive commented this out
  // for now but this needs digging
  // see issue https://github.com/entropyxyz/sdk/issues/414
  t.equal(
    programsDeployedAfterRemove.length,
    0,
    'eve has no deployed programs'
  )


  t.end()
})
