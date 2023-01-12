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

- 1. In one terminal window `./target/release/entropy --dev`
- 1. In another terminal window `./target/release/server --alice`
- 1. In another terminal `./scripts/server_bob.sh`

### Common Errors running tests

- 1. If computer is put to sleep or laptop is closes blockchain node will stop running and likely cause issues with the state of the blockchain. You will need to erase the chain key value store data and restart the node. in `entropy-core` run
     `./target/release/entropy purge-chain --dev`
     `rm -rf kvstore/`

- 1. If you forgot the `tofnd` password:
     - `./target/release/entropy purge-chain --dev`
     - `rm -rf kvstore/`
     - `./target/release/entropy --dev`
     - `./target/release/server --alice`

- 1. If you forgot bob's password:
     `rm -rf bob`
