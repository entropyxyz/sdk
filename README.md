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

## Example Usage

This example that instantiates Entropy, deploys a program, registers using the
deployed program, and signs a transaction.

### 1. Start Entropy

```js
import Entropy, { makeSeed, getWallet } from '@entropyxyz/sdk'

const seed = makeSeed()
const signer = await getWallet(seed)

// create an Entropy Account object
const entropyAccount = {
  sigRequestKey: signer,
  programModKey: signer,
}

const entropy = new Entropy({ account: entropyAccount })
await entropy.ready

// you have to wate for entropy to be ready
```

NOTE: Users should await the `ready` promise to ensure that the class has been
initialized before performing operations.

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

### 3. Register the deployed program

```js
import util from '@entropyxyz/sdk/util'
// TODO where is util coming from? Is it needed?
// TODO make this DX nicer

// configuration object
const config = `{
  "allowlisted_addresses": [
    "772b9a9e8aa1c9db861c6611a82d251db4fac990"
  ]
}`

// converts config to bytes
const encoder = new TextEncoder()
const byteArray = encoder.encode(config)

// converts U8Array to hex
const programConfig = util.u8aToHex(new Uint8Array(byteArray))

// construct Program Data
const programData = {
  programPointer,
  programConfig,
}

// Register this user with this program
const res = await entropy.register({
  keyVisibility: 'Permissioned',
  initialPrograms: [programData],
  programModAccount: 'insert ProgramModAccount address',
  // TODO what is programModAccount?
})
// on success, returns ...
// TODO what does it return?
```

<!-- // NICER DX
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
  value: 1,
  chainId: 1,
  nonce: 1,
  data: '0x' + Buffer.from('Created On Entropy').toString('hex'),
  // TODO what?
}

// get entropy signature
const signature = await entropy.signTransaction({
  txParams: basicTx,
  type: 'eth',
})

// TODO show this can be signed by a different Entropy instance?
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
