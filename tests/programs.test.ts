import ProgramManager from '../src/programs';
import { Signer } from '../src/types';
import { ApiPromise } from '@polkadot/api';
import { getWallet } from '../src/keys';
import {
  spinChain,
  disconnect,
  charlieSeed,
  sleep,
} from './testing-utils';
const { assert } = require('chai');

describe ('ProgramManager Tests', () => {
  let programManager: ProgramManager
  let chainProcess1, chainProcess2

  const chainPath = process.cwd () + '/Users/lreyes/Desktop/Github/entropy-js/tests/testing-utils/test-binaries/entropy'

  beforeEach(async function () {
    try {
      chainProcess1 = await spinChain (chainPath, 'alice', '9944')
      await sleep (3000)
      chainProcess2 = await spinChain (chainPath, 'bob', '9945')
    } catch (e) {
      console.log (e)
    }
    await sleep (9000)

    const seed: string = charlieSeed
    const endpoint: string = 'ws://127.0.0.1:9944'
    const substrate: ApiPromise = await ApiPromise.create ({ provider: endpoint as any })
    const signer = await getWallet (seed)

    programManager = new ProgramManager({ substrate, signer })
  });

  afterEach (async function () {
    await disconnect (this.substrate)
    await sleep (3000)
    chainProcess1.kill ()
    chainProcess2.kill ()
    await sleep (3000)
  });

  it('should set and get program correctly', async () => {
    const testProgram = new ArrayBuffer(8)

    await programManager.set(testProgram)

    const fetchedProgram = await programManager.get ()

    assert.deepEqual (fetchedProgram, testProgram, 'Programs should match')
  });

  it('should handle cases where no program is provided', async () => {
    // Do not set any program
    const fetchedProgram = await programManager.get ()

    assert.isNull(fetchedProgram, 'Program should be null if not set');
  });

  it('should throw an error if no program is defined for the given account', async () => {
    try {
      await programManager.get ();
      assert.fail ('Expected get method to throw but it did not.');
    } catch (error) {
      assert.equal (error.message, "No program defined for the given account.");
    }
  });

  it('should handle free transactions correctly', async () => {
    const testProgram = new ArrayBuffer(8)

    // Set the program using free transaction
    await programManager.set (testProgram)

    // Get the program
    const fetchedProgram = await programManager.get ()

    assert.deepEqual (fetchedProgram, testProgram, 'Programs should match after setting with free transaction')
  });
});
