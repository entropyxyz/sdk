@entropyxyz/SDK / [Exports](modules.md)

# SDK

` @entropyxyz/SDK` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

![EN-Backgrounds-2023-7-5_11-35-31](https://github.com/entropyxyz/entropy-js/assets/62079777/070ebeb6-6c70-4087-b901-9f82ee724dbf)

### Installation
yarn:
```js
yarn add @entropyxyz/SDK
```

npm:
```js
npm i @entropyxyz/SDK --save
```

### Usage

NOTICE 
`endpoint ` defaults to 'ws://127.0.0.1:9944' if no value is provided. 

```js
import Entropy from '@entropyxyz/SDK'

// Initialize entropy

const signer = await getWallet(charlieStashSeed)
const entropyAccount = {
  sigRequestKey: signer,
  programModKey: signer
}

const entropy = new Entropy({ account: entropyAccount})
await entropy.ready

```

