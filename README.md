# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

### Setup

### Node.js Version

Run `nvm use` to use the correct node version.
Make sure the project is running on node version 16

### Run Project

- `yarn`

### Linting

Linting is available and can be done by running `yarn eslint`. You can also use the ESLint extension if you're using VSCode.

### Using the SDK

#### Running the SDK Manually

The SDK needs a running Entropy node and a running TSS server. To run these, you can use the scripts in `entropy-core`.

- In **three separate terminals in the `entropy-core` directory**, run:
  - `./scripts/sdk-entropy-node.sh`
  - `./scripts/sdk-alice-tss.sh`
  - `./scripts/sdk-bob-tss.sh`

### Testing

#### Running tests

The manual steps listed above are automated in the test suite. To run the test suite, run `yarn test` in the root of the repo. This will spin up a local blockchain node, and two threshold server nodes. Reference the `testing-utils/spinUp.ts` file for more details.

### Test binaries

Add test binaries to `testing-utils/testing-binaries` folder from `entropy-core/target/release` folder. Move the `entropy` and `server` binaries to the `testing-binaries` folder.

Testing in this repo is done against `entropy-core`, so clone and setup that repo. After that, you can run the tests in this repo.

- Make sure you build release in `entropy-core` with `cargo build --release`.
- run `yarn test`. The tests will spin up three processes in the background (tss, bob, alice), and then run the tests.
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
