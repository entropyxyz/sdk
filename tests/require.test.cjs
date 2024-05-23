const test = require('tape')
// const { default: Entropy, wasmGlobalsReady } = require('@entropyxyz/sdk')
// const { default: Keyring } = require('@entropyxyz/sdk/keys')

// const charlieSeed = '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938'

test('CJS require', async t => {
  t.skip('TODO - get require working again')

  /*
  try {
    await wasmGlobalsReady()
    const keyring = new Keyring({ seed: charlieSeed })
    t.deepEqual(typeof keyring, 'object', 'keyring')

    t.true(
      typeof Entropy === 'function' && Entropy.name === 'Entropy',
      'Entropy class'
    )
  } catch (err) {
    t.error(err, 'no errors')
  }
  */

  t.end()
})

