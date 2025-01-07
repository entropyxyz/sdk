@entropyxyz/sdk / [Exports](modules.md)

# SDK

` @entropyxyz/sdk` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

![SDK](https://github.com/entropyxyz/sdk/assets/62079777/4e16b189-63ad-4753-9b0e-16dc85f5609f)

> This tool is early development. As such, a lot of things may not work as expected. Feel free to play around with it and report any issues at [github.com/entropyxyz/sdk](https://github.com/entropyxyz/sdk).

### Installation

yarn:

```js
yarn add @entropyxyz/sdk
```

npm:

```js
npm i @entropyxyz/sdk --save
```

### Usage

#### NOTICE

`endpoint ` defaults to 'ws://127.0.0.1:9944' if no value is provided.

The main interface to interact with Entropy.
This class provides methods to register, check registration status, interact with programs,
and sign transactions. Users should await the `ready` promise to ensure
that the class has been initialized before performing operations.

Below is an example that instantiates Entropy, deploys a program, registers using the deployed program, and signs a transaction.

**`Example`**

```typescript
//store that private key
import { Keyring } from '@entropyxyz/sdk/keys'
import { wasmGlobalsReady, Entropy } from '@entropyxyz/sdk'

await wasmGlobalsReady()

const newSeed = {seed || mnemonic}
const keyring = new Keyring(account)
// you should allways store what comes from this
let persistMe = keyring.accounts.toJson()
const saveToStorage = (state) => persistMe = state
keyring.accounts.on('account-update', (fullAccount) => { saveToStorage(fullAccount) })

let entropy = New Entropy({keyring, endpoint})
// session end

// new session with same account as before
// the second time you use entropy:
const loadedFromStorage = persistMe

const newKeyring = new Keyring(loadFromStorage)

keyring.accounts.on('account-update', (fullAccountAsJSON) => { saveToStorage(fullAccountAsJSON) })


entropy = new Entropy({keyring: newKeyring, endpoint})


```
