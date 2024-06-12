import test from 'tape'

import Entropy, { wasmGlobalsReady } from '../src'

async function testSetup() {
  await wasmGlobalsReady()
}




test('UNIT: constructor', async (t) => {
  await testSetup()
  try {
    // @ts-ignore: next line (i need you to not do your job here)
    new Entropy()
  } catch (e) {
    t.equal(e.message, 'missing opts object', 'should fail if no opts is passed')
  }
  t.end()
})
