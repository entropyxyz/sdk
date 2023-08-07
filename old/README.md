# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

## Expectation:
```js
import EntropyApi from '@entropyxyz/sdk(or what ever the fuck)'
import { generateAccount } from '@entropyxyz/sdk(or what ever the fuck)'

const { keyShares, sigRequestKeyPair, constraintModKeyPair } = generateAccount({ type: 'ECDSA' })

const config: EntropyConfig = {
  networkUrl: 'http://localhost:3001',
  account: {
    keyShare: '',
    sigRequestKeyPair: {public: '', private: ''},
    constraintModKeyPair: {public: '', private: ''},
  }, //base 64
  freeTxDefault: true,
  retryDefaults: 0,
}

// client checks "localStorage" for existing entropy keys if no keys create keys
const entropy: Entropy876 = Entropy.create(config)


// if no key and is a new account

// application side

// > {
// keyShares: [],
// sigRequestKeyPair: {public: '', private: ''},
// constraintModKeyPair: {public: '', private: ''}
// }
const myKeyShare: string = keyShares.pop()

const evmAddress: string = '0x123...'

const constraints: = {
  evmAcl: {
    addresses: [evmAddress], //
    kind: 'Allow', // 'Denny' black list address
    allowNullRecipient: false, // default false can be true. allows for contract creation
  },
}

entropy.substrate.isRegisterd() // is fully registered
entropy.substrate.isRegistering() // is waiting for key shares
const state = entropy.getAccountState() // 'NOT REGISTERED' 'REGISTERING' 'REGISTERED'

if (state === 'NONE') await entropy.register() // returns a promise
// store and save keyShare
// submit register transaction -> list of endpoints
// send each keyshare sent to an endpoint -> high five
// if register constraint transaction -> transaction hash
// if contrain transaction is complete resolve register function?


// set constraints

const currentConstraints = entropy.getConstraints(key: string)
await entropy.setConstraints(constraints)

const opts = {
  retries: 5, // //defaluts to constructor
  freetx: true //defaluts to constructor
  // for signTransaction:
  type: 'ETH' || 'POLKADOT' ||
}

const signature = await entropy.sign(sigRequest, opts)
// opinionated serialize
/*?*/ const transaction = await entropy.signTransaction(sigRequest, opts)

ethProvider.sendRawTransaction(transaction)

```


### Setup

### Node.js Version

Run `nvm use` to use the correct node version.
Make sure the project is running on node version 16

### Run Project

- `yarn`

### Linting

Linting is available and can be done by running `yarn eslint`. You can also use the ESLint extension if you're using VSCode.

### Testing

Testing in this repo is done against `entropy-core`, so clone and setup that repo. After that, you can run the tests in this repo.

- Make sure you build release in `entropy-core` with `cargo build --release`.
- In **three separate terminals in the `entropy-core` directory**, run:
  - `./scripts/sdk-entropy-node.sh`
  - `./scripts/sdk-alice-tss.sh`
  - `./scripts/sdk-bob-tss.sh`

This will spin up a local blockchain node, and two threshold server nodes.

Then, in this repo, **fourth terminal**, run `yarn test` in to run the tests.

### Note on tests

Tests require entropy core to be compiled and in this repo to run.

To run these tests

- Go to [core](https://github.com/entropyxyz/entropy-core), compile the repo
- Go into the target/release and copy over entropy and server binaries
- Add them to testing-utils/testing-binaries

### Typegen

When the Substrate node in `entropy-core` is updated, you will need to update the type metadata. To do this:

#### in `entropy-core`

- `cargo build --release -p entropy`
- `./scripts/sdk-entropy-node.sh`

#### in entropy-js

- `cd ./packages/substrate/`
- `./update-metadata.sh`

`packages/substrate/entropy-metadata.json` should be populated with the latest Entropy node metadata

### Common Errors running tests

Check if your machine is running any entropy or server processes. If so, kill them. This can happen if tests run, fail and don't kill the spawned processes that was running from the test suite.

- `lsof -i -P -n | grep LISTEN`
- `pkill entropy`
- `pkill server`

- In `entropy-core`, make sure you run `cargo build --release` (and `cargo build`) so any `./scripts` use the latest binaries.
- Make sure you have the latest dependencies in `entropy-js` by running `yarn clean:all` in the root of the repo, and then `yarn`.
