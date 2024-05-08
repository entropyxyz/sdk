import test from 'tape'
import { readFileSync } from 'fs'

import Entropy from '../src'
import { buf2hex } from '../src/utils'
import {
  spinNetworkUp,
  createTestAccount,
  spinNetworkDown,
} from './testing-utils'

const networkType = 'two-nodes'
let entropy: Entropy

test('Programs Test', async (t) => {
  try {
    await spinNetworkUp(networkType)
    entropy = await createTestAccount(entropy)
  } catch (error) {
    console.error('Error spinning network up', error)
  }

  t.teardown(async () => {
    try {
      await spinNetworkDown(networkType, entropy)
    } catch (err) {
      console.error('Error while spinning network down', err.message)
    }
  })

  // await sleep(60000)

  const dummyProgram = readFileSync(
    './tests/testing-utils/template_barebones.wasm'
  )
  const pointer = (await entropy.programs.dev
    .deploy(dummyProgram)
    .then((pointer) => {
      t.pass('program deployed')
      return pointer
    })
    .catch((err) => t.error(err, 'program deployed'))) as string

  const fetchedProgram = await entropy.programs.dev
    .get(pointer)
    // @ts-ignore next line
    .then((program) => {
      t.pass('fetched program')
      return program
    })
    .catch((err) => t.error(err, 'fetched program'))

  t.equal(
    // @ts-ignore next line
    buf2hex(fetchedProgram.bytecode),
    buf2hex(dummyProgram),
    'everything looks GREAT'
  )

  t.end()
})
