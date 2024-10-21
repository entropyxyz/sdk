import test from 'tape'

import { Entropy, wasmGlobalsReady } from '../src'
import { Keyring } from '../src/keys'

import { eveSeed as seed } from './testing-utils/constants'

async function testSetup() {
  await wasmGlobalsReady()
}

test('Entropy - constructor', async (t) => {
  await testSetup()

  t.throws(
    // @ts-ignore
    () => new Entropy(),
    /missing opts object/,
    'no opts => error'
  )

  {
    const DESCRIPTION = 'endpoint: dead => error'
    const entropy = new Entropy({
      keyring: new Keyring({ seed }),
      endpoint: 'ws://127.0.0.1:999'
    })

    await entropy.ready
      .then(() => t.fail(DESCRIPTION))
      .catch(err => t.match(err.message, /ECONNREFUSED/, DESCRIPTION))

    await entropy.close()
  }

  {
    const DESCRIPTION = 'endpoint: nonsense => error'
    const entropy = new Entropy({
      keyring: new Keyring({ seed }),
      endpoint: 'derp'
    })

    await entropy.ready
      .then(() => t.fail(DESCRIPTION))
      .catch(err => t.match(err.message, /should start with.*ws/, DESCRIPTION))

    await entropy.close()
  }

  t.end()
})
