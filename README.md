<!--


THIS FILE HAS A CUSTOM PARSER CHANGING ANYTHING MAY AFFECT README TEST


 -->
@entropyxyz/sdk / [Exports](modules.md)

# SDK

**This is currently in alpha release.**

`@entropyxyz/sdk` is a typescript library that allow you to interact with the Entropy network and assist in requesting signatures. This includes convince wrappers to execute tasks such as registering a set of programs for a resulting verifying key (entropy account) and requesting signatures from that verifying key

![SDK](https://github.com/entropyxyz/sdk/assets/62079777/4e16b189-63ad-4753-9b0e-16dc85f5609f)

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

The main interface to interact with Entropy.
This class provides methods to register, check registration status, interact with programs,
and sign transactions. Users should await the `ready` promise to ensure
that the class has been initialized before performing operations.

Below is an example that instantiates Entropy, deploys a program, registers using the deployed program, and signs a transaction.

**`Example`**
The example below walks you threw basic flow from registration of an account to requesting and verifying signatures. for more in depth walk threw flow see are [end-to-end test](./tests/end-to-end.test.ts)
<!-- DO NOT CHANGE THE NEXT LINE WITHOUT CHANGING THE TEST PARSER! -->
```typescript
import { Keyring } from '@entropyxyz/sdk/keys'
import { wasmGlobalsReady, Entropy } from '@entropyxyz/sdk'

async function basicExample () {
  // let wasam crypto libs load before use
  await wasmGlobalsReady()

  const eveSeed = '0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a'

  const keyStore = { seed: eveSeed }
  const keyring = new Keyring(keyStore)
  const opts = {
    endpoint: 'ws://127.0.0.1:9944', //defaults to 'ws://127.0.0.1:9944' if no value is provided.
    keyring,
  }
  const entropy = new Entropy({keyring, endpoint})

  await entropy.ready
  // this is default program registration and configuration see deep dive docs for full explanation of function usage
  const msgObject = {
    msg: Buffer.from('Hello world: signature from entropy!').toString('hex'),
  }
  const verifyingKey = await entropy.register()
  const signatureData = await entropy.signWithAdaptersInOrder({
    msg: msgObject,
    order: ['deviceKeyProxy'],
  })
  if (!await entropy.verify(signatureData)) throw new Error('can not verify signature')
  const { signature } = signatureData
  // do stuff with signature
  /**your code here**/
  // close websocket connection
  await entropy.close()
}

basicExample()
```

This tool is early development. As such, a lot of things may not work as expected. Feel free to play around with it and report any issues at [github.com/entropyxyz/sdk](https://github.com/entropyxyz/sdk).