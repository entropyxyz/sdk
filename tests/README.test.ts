import test from 'tape'
import { readFileSync } from 'fs'
import {
  promiseRunner,
  spinNetworkUp,
  jumpStartNetwork,
  eveSeed,
  eveAddress,
  spinNetworkDown,
} from './testing-utils'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'


const networkType = 'four-nodes'

const msg = Buffer.from('Hello world: signature from entropy!').toString('hex')

test('README basicExample', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))
  t.teardown(async () => {
    await spinNetworkDown(networkType).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })
  await run('wasm', wasmGlobalsReady())

  const eveKeyring = new Keyring({ seed: eveSeed, debug: true })

  const jumpEntropy = new Entropy({
    keyring: eveKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })

  await run(
    'entropy ready',
    jumpEntropy.ready
  )
  await run('jump-start network', jumpStartNetwork(jumpEntropy))
  await run('close jumpEntropy', jumpEntropy.close())

  async function basicExample() {
      await wasmGlobalsReady();

      const seed = '0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a';
      const keyStore = { seed };
      const keyring = new Keyring(keyStore);
      const opts = {
          endpoint: 'ws://127.0.0.1:9944',
          keyring
      };
      const entropy = new Entropy(opts);

      await entropy.ready;

      // This is the default program registration and configuration.
      const msgObject = {
          msg: Buffer.from('Hello world: signature from entropy!').toString('hex')
      };

      const verifyingKey = await entropy.register();
      const signatureData = await entropy.signWithAdaptersInOrder({
          msg: msgObject,
          order: ['deviceKeyProxy']
      });

      if (!await entropy.verify(signatureData)) throw new Error('can not verify signature');
      const { signature } = signatureData;

      // ------------------
      // Here is where you
      // could do stuff
      // with the signature.
      // ------------------

      await entropy.close()
  }
  await run('basicExample should be executable', basicExample())

  // parse code to remove import stamens and comments
  // and the run
  const README = readFileSync('./README.md', 'utf-8')
  t.ok(README, 'README should exist')
  const codeExample = README.split('```typescript')[1].split('```')[0]
  const inReadmeBasicExample = codeExample.split('\n').reduce((a, i) => {
    if(i.includes('// ')) return a
    if(i.includes('import')) return a
    if(i.includes('basicExample()')) return a
    if (i.length === 0) return a
    return a+i
  // all these splits and joins is to get rid of the 4 space tabs
  }, 'async function basicExample() {').split(' ').join('').split('\'').join('"')
  const basicExampleString = basicExample.toString().split(' ').join('')
  t.equal(inReadmeBasicExample, basicExampleString, 'the basic example function should match README')
  t.end()
})
