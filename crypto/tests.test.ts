import { readKey } from '../core/utils'
import { Crypto } from './index'
import 'mocha'

const { assert } = require('chai')

describe('Crypto Tests', async () => {
  const crypto = new Crypto()
  const mockData = {
    endpoint: '127.0.0.1:3001',
    tssAccount: '5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN',
    x25519PublicKey:
      '0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22',
  }

  it(`parses server threshold info`, async () => {
    const mockReturn = [
      10,
      192,
      41,
      240,
      184,
      83,
      178,
      59,
      237,
      101,
      45,
      109,
      13,
      230,
      155,
      124,
      195,
      141,
      148,
      249,
      55,
      50,
      238,
      252,
      133,
      181,
      134,
      30,
      144,
      247,
      58,
      34,
    ]

    const result = await crypto.parseServerDHKey(mockData)
    assert.deepEqual(result.toString(), mockReturn.toString())
  })
  it(`encrypts and signs`, async () => {
    const aliceSecretKey: Uint8Array = new Uint8Array([
      152,
      49,
      157,
      79,
      248,
      169,
      80,
      140,
      75,
      176,
      207,
      11,
      90,
      120,
      215,
      96,
      160,
      178,
      8,
      44,
      2,
      119,
      94,
      110,
      130,
      55,
      8,
      22,
      254,
      223,
      255,
      72,
      146,
      90,
      34,
      93,
      151,
      170,
      0,
      104,
      45,
      106,
      89,
      185,
      91,
      24,
      120,
      12,
      16,
      215,
      3,
      35,
      54,
      232,
      143,
      52,
      66,
      180,
      35,
      97,
      244,
      166,
      96,
      17,
    ])
    const serverDHKey = await crypto.parseServerDHKey(mockData)
    const root = process.cwd()
    const thresholdKey = (await readKey(
      `${root.split('packages/')[0]}/0`
    )) as Uint8Array
    const result = await crypto.encryptAndSign(
      aliceSecretKey,
      thresholdKey,
      serverDHKey
    )

    assert.closeTo(result.length, 8130, 20)
  })
})
