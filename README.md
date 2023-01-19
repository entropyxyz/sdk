# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

## Devs

### Setup

`yarn`

### Linting

Linting is available and can be done by running `yarn eslint`. You can also use the ESLint extension if you're using VSCode.

### Testing

Tests in `@entropy/substrate` will fail if you do not have a running [Entropy Node](https://github.com/entropyxyz/entropy-core) **with** the `--ws-external` flag (WebSockets are disabled by default).

Steps to run entropy node:

- 1. `git clone git@github.com:entropyxyz/entropy-core.git`
- 1. `cd entropy-core`
- 1. go through the `README.md` and setup instructions in `entropy-core`

Running the dev server and blockchain:

- 1. in `cargo run --release -p entropy -- --dev` in `entropy-core` root directory
- 1. in another terminal run `cargo run --release -p server -- --alice` in `entropy-core` root directory

- 1. In another terminal run `./scripts/server_bob.sh` in `entropy-js` root directory

### Common Errors running tests

- 1. If computer is put to sleep or laptop is closed, the blockchain node will stop running and likely cause issues with the state of the blockchain. You will need to erase the chain key value store data and restart the node. in `entropy-core` run
     `./target/release/entropy purge-chain --dev`
     `./target/release/entropy purge-chain --dev`
     `rm -rf kvstore/`

- 1. If you forgot the `tofnd` password:
     - `rm -rf kvstore/`
     - `./target/release/entropy --dev`
     - `./target/release/server --alice`

- 1. If you forgot bob's password:
     `rm -rf bob`
