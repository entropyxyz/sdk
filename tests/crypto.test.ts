import test from 'tape'
import { crypto, cryptoIsLoaded } from '../src/utils/crypto'
import { stripHexPrefix } from '../src/utils'

import { promiseRunner, readKey } from './testing-utils'

test('Crypto', async (t) => {
  const run = promiseRunner(t)

  await run('crypto loaded', cryptoIsLoaded)

  const mockData = {
    endpoint: '127.0.0.1:3001',
    tssAccount: '5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN',
    x25519_public_key: stripHexPrefix(
      '0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22'
    ),
  }

  /* Parse threshold info */
  {
    const expected = [
      10, 192, 41, 240, 184, 83, 178, 59, 237, 101, 45, 109, 13, 230, 155, 124,
      195, 141, 148, 249, 55, 50, 238, 252, 133, 181, 134, 30, 144, 247, 58, 34,
    ].toString()

    const result = await run(
      'fromHex',
      crypto.fromHex(mockData.x25519_public_key)
    )
    t.deepEqual(result.toString(), expected, 'fromHex correct')
  }

  /* Encrypt + sign */
  {
    const aliceSecretKey: Uint8Array = new Uint8Array([
      152, 49, 157, 79, 248, 169, 80, 140, 75, 176, 207, 11, 90, 120, 215, 96,
      160, 178, 8, 44, 2, 119, 94, 110, 130, 55, 8, 22, 254, 223, 255, 72, 146,
      90, 34, 93, 151, 170, 0, 104, 45, 106, 89, 185, 91, 24, 120, 12, 16, 215,
      3, 35, 54, 232, 143, 52, 66, 180, 35, 97, 244, 166, 96, 17,
    ])

    const alicePublicKey = await run(
      'publicKeyFromSecret works',
      crypto.publicKeyFromSecret(aliceSecretKey)
    )

    const serverDHKey = await run(
      'fromHex works',
      crypto.fromHex(mockData.x25519_public_key)
    )
    const root = process.cwd()

    const thresholdKey = (await readKey(
      `${root + '/tests/testing-utils/test-keys/0'}`
    )) as Uint8Array

    const result = await run(
      'encryptAndSign',
      crypto.encryptAndSign(aliceSecretKey, thresholdKey, alicePublicKey)
    )
    const expected = await run(
      'decryptAndVerify',
      crypto.decryptAndVerify(aliceSecretKey, result)
    )
    t.deepEqual(expected, thresholdKey, 'decrypt works')
  }

  t.end()
})

// not currently sure how to handle thresholdKey since i believe it should be "encoded" per encrypt_and_sign
