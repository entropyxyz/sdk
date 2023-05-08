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

### Common Errors running tests

Check if your machine is running any entropy or server processes. If so, kill them. This can happen if tests run, fail and don't kill the spawned processes that was running from the test suite.

- `lsof -i -P -n | grep LISTEN`
- `pkill entropy`
- `pkill server`

- In `entropy-core`, make sure you run `cargo build --release` (and `cargo build`) so any `./scripts` use the latest binaries.
- Make sure you have the latest dependencies in `entropy-js` by running `yarn clean:all` in the root of the repo, and then `yarn`.
