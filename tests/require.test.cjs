const test = require('tape')
const { default: DefaultEntropy, Entropy, wasmGlobalsReady } = require('@entropyxyz/sdk')
const { default: DefaultKeyring, Keyring } = require('@entropyxyz/sdk/keys')

const charlieSeed = '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938'

test('CJS require', async t => {
  try {
    t.deepEqual(DefaultEntropy, Entropy, 'Entropy exported as default + named')
    await wasmGlobalsReady()
    t.true(
      typeof Entropy === 'function'
      && Entropy.name === 'Entropy',
      'Entropy is a class'
    )

    t.deepEqual(DefaultKeyring, Keyring, 'Keyring exported as default + named')
    const keyring = new Keyring({ seed: charlieSeed })
    t.deepEqual(typeof keyring, 'object', 'Keyring works')

  } catch (err) {
    t.error(err, 'no errors')
  }

  t.end()
})

