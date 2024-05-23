import test from 'tape'
// import { readFileSync } from 'fs'

// import Entropy from '../src'
// import { buf2hex } from '../src/utils'
// import {
//   promiseRunner,
//   spinNetworkUp,
//   createTestAccount,
//   spinNetworkDown,
// } from './testing-utils'

// const networkType = 'two-nodes'
// let entropy: Entropy

// async function testTeardown() {
//   await spinNetworkDown(networkType, entropy).catch((err) => {
//     console.error('Error while spinning network down', err.message)
//   })
// }

test('Programs', async (t) => {
  t.skip('TODO - fix or delete')
  /*
  const run = promiseRunner(t)

  await run('network up', spinNetworkUp(networkType))
  entropy = await run('account', createTestAccount(entropy))
  t.teardown(testTeardown)

  // await sleep(60000)

  const dummyProgram = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  const pointer = await run(
    'deploy program',
    entropy.programs.dev.deploy(dummyProgram)
  )

  const fetchedProgram = await run(
    'get program',
    entropy.programs.dev.get(pointer)
  )

  t.equal(
    // @ts-ignore next line
    buf2hex(fetchedProgram.bytecode),
    buf2hex(dummyProgram),
    'everything looks GREAT'
  )
  */

  t.end()
})
