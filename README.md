> ¡¡ This is currently in **alpha** release !!

# @entropyxyz/sdk

A collection of TS packages that allow you to interact with the [Entropy
network](https://entropy.xyz).

The main interface to interact with Entropy. This class provides methods to
register, check registration status, interact with programs, and sign
transactions.

## Install

```bash
npm i @entropyxyz/sdk
```

TODO: Clarfiy accounts on entropy the network along with key scheme and how they are used

## Example Usage

This example that instantiates Entropy, deploys a program, registers using the
deployed program, and signs a transaction.

### 1. Start Entropy

```js
import { generateSeed } from '@entropyxyz/sdk/keys'
import Entropy from '@entropyxyz/sdk'

// this is where you would provide seed material see
const deviceSeed = generateSeed()
const programModSeed = generateSeed()
// create an Entropy Account object
const entropySeedMaterial = {
  deviceSeed,
  programModSeed,
}

const entropy = new Entropy({
  account: entropySeedMaterial,
  endpoint: 'ws://127.0.0.1:9944',
})

// you have to wait for entropy to be ready
await entropy.ready

// you need to fund your entropy address before registering your new entropy account

const address = entropy.programModKey.address
```

NOTE: Users should await the `ready` promise to ensure that the class has been
initialized before performing operations.

### 3. Register your entropy account

```js
import util from '@entropyxyz/sdk/util'
// TODO where is util coming from? Is it needed?
// TODO make this DX nicer

const programPointer = `0x0000000000000000000000000000000000000000000000000000000000000000`
// configuration object
const programConfig = {
  // who can request a signature from entropy
  allowlisted_addresses: [entropy.account.devceKey.address],
}

// construct Program Data
const programData = {
  programPointer,
  programConfigs,
}

// Register this user with this program
// it will return the verifying key as a string
// this key will be needed for signing and for verfiyg the signature of the signed message.

// register is only run once
// it is setting what programs you want with your chossen configurations
// and getting back the verfyingKey that your signatures in entropy.signTransaction resolve to for that given program set

// this costs tokens
const verfiyingKey = await entropy.register({
  initialPrograms: [programData],
  // TODO what is programModAccount?
})
// TO-DO get address from signer

// on success, returns ...
// TODO what does it return?
```

<!-- // TODO: NICER DX
const programData = {
  programPointer,
  programConfig: {
    allowlisted_addresses: [
      '772b9a9e8aa1c9db861c6611a82d251db4fac990'
    ]
  }
,
}

// Register this user with this program
await entropy.register({
  keyVisibility: 'Permissioned',
  initialPrograms: [programData],
  programModAccount: 'insert ProgramModAccount address'
})
// on success, returns TODO
-->

### 4. Sign a transaction!

```js
// basic transaction composition
const basicTx = {
  to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
  // TODO why is this different to allowlisted_addresses ?
  value: 0,
  chainId: 1,
  nonce: 1,
  data: '0x00',
  // TODO what?
}

// get entropy signature
const signature = await entropy.signTransaction({
  txParams: basicTx,
  type: 'eth',
})

// TODO show this can be signed by a different Entropy instance?
```

from another device but an already registered account

```ts

import { generateSeed } from '@entropyxyz/sdk/keys'
import Entropy from '@entropyxyz/sdk'

// this is where you would provide seed material see
const deviceSeed = generateSeed()
// create an Entropy Account object
const entropyAccount = {
  deviceSeed,
  verfiyingKeys: [verfiyingKey/*this is the verfiying key recived when you register*/]
  type: 'REGISTERED_ACCOUNT'
}

const entropy = new Entropy({
  account: entropyAccountJson,
  endpoint: 'ws://127.0.0.1:9944',
})

// you have to wait for entropy to be ready
await entropy.ready


// TODO allow device seed by setting the program config for program entropy.programs.set?

const basicTx = {
  to: '0x772b9a9e8aa1c9db861c6611a82d251db4fac990',
  // TODO why is this different to allowlisted_addresses ?
  value: 0,
  chainId: 1,
  nonce: 1,
  data: '0x00'
  // TODO what?
}

// get entropy signature
const signature = await entropy.signTransaction({
  txParams: basicTx,
  type: 'eth',
  verfiyingKey,
})
```

### 2. Deploy a program

```js
import { readFileSync } from 'fs'

const basicTxProgram = readFileSync(
  './tests/testing-utils/template_basic_transaction.wasm'
)

const programPointer = await entropy.programs.dev.deploy(basicTxProgram)
// returns pointer hash
// QUESTION: what's the dev.deploy
// QUESTION: is this idempotent?
// QUESTION: what stops DDOS?
```

## Documentation

See TODO URL

Or build a copy locally:

```bash
npm run generate:docs
npx serve docs
```

## Development

See [dev/](./dev/README.md)

---

## WIP

- find out what to do with this:
  > `endpoint` defaults to `ws://127.0.0.1:9944` if no value is provided.
