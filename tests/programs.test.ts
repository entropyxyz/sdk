import tape from 'tape'
import { readFileSync } from 'fs'

import Entropy from '../src'
import { buf2hex } from '../src/utils'
import {
  sleep,
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'two-nodes'
let entropy: Entropy

tape('Programs Test', async (t) => {
  t.plan(1)
  // Test spin up
  try {
    await sleep(30000)
    await spinNetworkUp(networkType)
    entropy = await createTestAccount(entropy)
  } catch (error) {
    console.error('Error spinning network up', error)
  }

  await sleep(60000)

  const dummyProgram = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  const pointer = await entropy.programs.dev.deploy(dummyProgram)
  const fetchedProgram = await entropy.programs.dev.get(pointer)
  t.equal(buf2hex(fetchedProgram.bytecode), buf2hex(dummyProgram))

  try {
    await spinNetworkDown(networkType, entropy)
  } catch (error) {
    console.error('Error while spinning network down', error.message)
  } finally {
    t.end()
  }
})
