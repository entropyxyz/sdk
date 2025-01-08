<!--@entropyxyz/sdk / [Exports](modules.md)-->

# Entropy JavaScript SDK

> [!WARNING]  
> This project is currently in _alpha_, and should be considered unstable.

The `@entropyxyz/sdk` is a typescript library allowing developers to interact with the Entropy network and easily request signatures. This includes concise wrappers to execute tasks such as registering a set of programs for a resulting verifying key (entropy account) and requesting signatures from that verifying key.

![SDK](https://github.com/entropyxyz/sdk/assets/62079777/4e16b189-63ad-4753-9b0e-16dc85f5609f)

## Installation

**NPM**:

```javascript
npm install @entropyxyz/sdk --save
```

**Yarn**:

```javascript
yarn add @entropyxyz/sdk
```

## Usage

The main interface to interact with Entropy. This class provides methods to register, check registration status, interact with programs, and sign transactions. Users should await the `ready` promise to ensure the class is initialized before performing operations.

### Basic example

The example below walks you through registering an account, requesting signatures from the validating group, and then verifying those signatures. For a more in-depth walkthrough, see our [end-to-end test](./tests/end-to-end.test.ts).

```typescript
import { Keyring } from '@entropyxyz/sdk/keys';
import { wasmGlobalsReady, Entropy } from '@entropyxyz/sdk';

async function basicExample() {
    await wasmGlobalsReady();
    
    const seed = '0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a';
    const keyStore = { seed };
    const keyring = new Keyring(keyStore);
    const opts = {
        endpoint: 'ws://127.0.0.1:9944',
        keyring
    };
    const entropy = new Entropy(opts);

    await entropy.ready;
    
    // This is the default program registration and configuration.
    const msgObject = {
        msg: Buffer.from('Hello world: signature from entropy!').toString('hex')
    };
    
    const verifyingKey = await entropy.register();
    const signatureData = await entropy.signWithAdaptersInOrder({
        msg: msgObject,
        order: ['deviceKeyProxy']
    });
    
    if (!await entropy.verify(signatureData)) throw new Error('can not verify signature');
    const { signature } = signatureData;
    
    // ------------------
    // Here is where you 
    // could do stuff 
    // with the signature.
    // ------------------

    await entropy.close()
}

basicExample();
```

## Issues and bugs

This tool is in early development. As such, a lot of things may not work as expected. Feel free to play around with the SDK and report any issues in the [issues tab](https://github.com/entropyxyz/sdk/issues/new).
