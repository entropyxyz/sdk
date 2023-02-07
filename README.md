# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

### Setup

### Node.js Version

Run `nvm use` to use the correct node version.

### Run Project

- `yarn`

### Linting

Linting is available and can be done by running `yarn eslint`. You can also use the ESLint extension if you're using VSCode.

### Testing

Testing in this repo is done against `entropy-core`, so clone and setup that repo. After that, you can run the tests in this repo.

- Make sure you build release in `entropy-core` with `cargo build --release`.
- In **three seperate terminals**, run:
  - `./scripts/sdk-entropy-node.sh`
  - `./scripts/sdk-alice-tss.sh`
  - `./scripts/sdk-bob-tss.sh`

This will spin up a local blockchain node, and two threshold server nodes.

Then, in this repo, **fourth terminal**, run `yarn test` in to run the tests.

### Note on tests

Currently, the tests only work on the first run. This is because the `entropy-core` node is not reset between tests. To get all test to pass again run the commands above:

- `./scripts/sdk-entropy-node.sh`
- `./scripts/sdk-alice-tss.sh`
- `./scripts/sdk-bob-tss.sh`

This will be fixed in the future.

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

- In `entropy-core`, make sure you run `cargo build --release` (and `cargo build`) so any `./scripts` use the latest binaries.
- Make sure you have the latest deps in `entropy-js` by running `yarn clean:all` in the root of the repo, and then `yarn`.
