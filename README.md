# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

## Devs

### Setup

`yarn`

### Linting

Linting is available and can be done by running `yarn eslint`. You can also use the ESLint extension if you're using VSCode.

### Testing

Tests in `@entropy/substrate` will fail if you do not have a running [Entropy Node](https://github.com/entropyxyz/entropy-core) **with** the `--ws-external` flag (WebSockets are disabled by default).

