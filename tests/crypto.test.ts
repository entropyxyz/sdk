import tape from 'tape'
import { crypto, cryptoIsLoaded } from '../src/utils/crypto'
import { readKey } from './testing-utils/readKey'

function stripHexPrefix(str: string): string {
  return str.startsWith('0x') ? str.slice(2) : str
}

tape('Crypto Tests', async (t) => {
  // Before all
  try {
    await cryptoIsLoaded
  } catch (error) {
    console.error('Error while checking if cryptoIsLoaded')
  }
  const mockData = {
    endpoint: '127.0.0.1:3001',
    tssAccount: '5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN',
    x25519_public_key: stripHexPrefix(
      '0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22'
    ),
  }

  t.test('should parse server threshold info', async (t2) => {
    const mockReturn = [
      10, 192, 41, 240, 184, 83, 178, 59, 237, 101, 45, 109, 13, 230, 155, 124,
      195, 141, 148, 249, 55, 50, 238, 252, 133, 181, 134, 30, 144, 247, 58, 34,
    ]

    const result = await crypto.fromHex(mockData.x25519_public_key)
    t2.equal(result.toString(), mockReturn.toString())
    t2.end()
  })

  t.test('should encrypt and sign', async (t3) => {
    const aliceSecretKey: Uint8Array = new Uint8Array([
      152, 49, 157, 79, 248, 169, 80, 140, 75, 176, 207, 11, 90, 120, 215, 96,
      160, 178, 8, 44, 2, 119, 94, 110, 130, 55, 8, 22, 254, 223, 255, 72, 146,
      90, 34, 93, 151, 170, 0, 104, 45, 106, 89, 185, 91, 24, 120, 12, 16, 215,
      3, 35, 54, 232, 143, 52, 66, 180, 35, 97, 244, 166, 96, 17,
    ])

    const alicePublicKey = await crypto.publicKeyFromSecret(aliceSecretKey)

    const serverDHKey = await crypto.fromHex(mockData.x25519_public_key)
    const root = process.cwd()

    const thresholdKey = (await readKey(
      `${root + '/tests/testing-utils/test-keys/0'}`
    )) as Uint8Array

    const result = await crypto.encryptAndSign(
      aliceSecretKey,
      thresholdKey,
      alicePublicKey
    )
    t3.deepEqual(
      await crypto.decryptAndVerify(aliceSecretKey, result),
      thresholdKey
    )

    t3.end()
  })
})

// not currently sure how to handle thresholdKey since i believe it should be "encoded" per encrypt_and_sign
