import test from 'tape'
import { crypto, cryptoIsLoaded } from '../src/utils/crypto'
import { stripHexPrefix } from '../src/utils'
import { promiseRunner, readKey } from './testing-utils'
import { charlieStashSeed } from './testing-utils/constants'
import { hexStringToUint8Array } from '../src/utils'
import { generateKeyPairFromSeed } from '../src/keys/utils'


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
    const charlieSecretSeed: Uint8Array = hexStringToUint8Array(charlieStashSeed)

    const charlieKeyPair = generateKeyPairFromSeed(charlieStashSeed)

    const charliePublicKeyPair = await run(
      'publicKeyFromSecret works',
      crypto.fromSecretKey(charlieSecretSeed)
    )
    const charliePublicKey = charliePublicKeyPair.publicKey()
    const charlieSecretKey = charliePublicKeyPair.secretKey()

    console.log( " charlier  public ", charliePublicKey)
    console.log (" Charlie secret",charlieSecretKey )

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
      crypto.encryptAndSign(
        charlieKeyPair.pair.secretKey,
        thresholdKey,
        charliePublicKey,
        serverDHKey,
      )
    )
    const expected = await run(
      'decryptAndVerify',
      crypto.decryptAndVerify(charlieSecretSeed, result)
    )
    t.deepEqual(expected, thresholdKey, 'decrypt works')
  }

  t.end()
})

// not currently sure how to handle thresholdKey since i believe it should be "encoded" per encrypt_and_sign
