import test from 'tape'
import Entropy from '@entropyxyz/sdk'
import { getWallet } from '@entropyxyz/sdk/keys'

const charlieSeed =
  '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938'

test('ESM import', async (t) => {
  try {
    const signer = await getWallet(charlieSeed)
    t.deepEqual(typeof signer, 'object', 'getWallet')

    t.true(
      typeof Entropy === 'function' && Entropy.name === 'Entropy',
      'Entropy class'
    )
  } catch (err) {
    t.error(err, 'no errors')
  }

  t.end()
})
