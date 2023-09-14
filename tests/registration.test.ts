import RegistrationManager from '../src/registration';
import { RegistrationParams } from '../src/registration';
import { getWallet } from '../src/keys';
import Entropy from './../src/index';
import {
  spinChain,
  spinThreshold,
  removeDB,
  disconnect,
  modifyOcwPostEndpoint,
  charlieSeed,
  charlieStashAddress,
  sleep,
} from './testing-utils';
import { readKeyasync } from '../src/utils';
import { assert } from 'chai';

describe('Registration Tests', () => {
  let registrationManager: RegistrationManager
  let chainProcess1, chainProcess2, serverProcess1, serverProcess2
  let charlieStashEntropy: Entropy

  const chainPath = process.cwd() + '/tests/testing-utils/test-binaries/entropy'
  const serverPath = process.cwd() + '/tests/testing-utils/test-binaries/server'

  beforeEach(async () => {
    serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
    serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
    chainProcess1 = await spinChain(chainPath, 'alice', '9944')
    await sleep(3000)
    chainProcess2 = await spinChain(chainPath, 'bob', '9945')
    await sleep(9000)
    await modifyOcwPostEndpoint('ws://127.0.0.1:9945', 'http://localhost:3002/signer/new_party')

    const seed: string = charlieSeed
    const endpoint: string = 'ws://127.0.0.1:9944'

    // Initialize Entropy instance
    charlieStashEntropy = new Entropy ({
      seed: charlieSeed,
      endpoint: endpoint,
    });

    // Initialize RegistrationManager
    registrationManager = new RegistrationManager ({
      substrate: charlieStashEntropy.substrate,
      signer: charlieStashEntropy.keys,
    });
  });

  afterEach(async () => {
    await disconnect (registrationManager.substrate)
    await sleep (3000)
    serverProcess1.kill ()
    serverProcess2.kill ()
    chainProcess1.kill ()
    chainProcess2.kill ()
    await sleep (3000)
    removeDB ()
  });

  it('should register user on-chain and with threshold servers', async () => {
    const root = process.cwd ();
    const thresholdKey = await readKeyasync (`${root}/tests/testing-utils/test-keys/0`);
    const thresholdKey2 = await readKeyasync (`${root}/tests/testing-utils/test-keys/1`);

    const registrationParams = {
      keyShares: [
        { keyShare: thresholdKey },
        { keyShare: thresholdKey2 }
      ],
      programModAccount: charlieStashAddress,
      freeTx: false,
    }

    // Register the user using the Entropy class and RegistrationManager
    await registerUser (charlieStashEntropy, registrationManager, registrationParams)

    // Check if the user is registered
    const isRegistered = await registrationManager.checkRegistrationStatus (charlieStashEntropy.keys.wallet.address)
    assert.isTrue (isRegistered, 'User should be registered')
  });
});

// Function to register a user using the Entropy class and RegistrationManager
async function registerUser (entropy: Entropy, registrationManager: RegistrationManager, params: RegistrationParams) {
  await entropy.ready
  const address = entropy.keys.wallet.address
  const isCurrentlyRegistered = await registrationManager.checkRegistrationStatus (address)
  if (isCurrentlyRegistered) {
    throw new Error('Already registered')
  }

  const registerTx = entropy.substrate.tx.relayer.register(address, params.initialProgram || null)
  await registrationManager.sendAndWaitFor (registerTx, params.freeTx, {
    section: 'relayer',
    name: 'SignalRegister',
  });
}
