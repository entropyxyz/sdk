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

Testing in this repo is done against `entropy-core`. The tests expect binaries from that repo to be in `testing-utils/test-binaries`

You either build these binaries yourself by cloning `entropy-core`, running `cargo build --release` and then copying the binaries `server`, and `entropy` from `target/release/` in that repo to `testing-util/test-binaries` in this repo.

Or you can get pre-built binaries from [testing.entropy.family/releases](https://testing.entropy.family/releases), eg:

`curl 'https://testing.entropy.family/releases/entropy/entropy.tar.zst' -o entropy.tar.zst && tar xvf entropy.tar.zst && mv entropy*/* testing-utils/test-binaries`

You may need to install [Zstandard compression](https://facebook.github.io/zstd/) to unpack the archive.

Once you have those binaries in the right place, run `yarn test`.

The tests will spin up a local blockchain node, and two threshold server nodes.

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
