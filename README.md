# entropy-js

DISCLAMER: VERSIONS OF ENTROPY-JS BEFORE VERSION 0.1.2 MAY HAVE BREAKING CHANGES BETWEEN VERSIONS THIS PROJECT IS UNSTABLE TILL THEN


`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.


### Instillation
yarn:
```yarn add @entropyxyz/entropy-js```

yarn:
```npm i @entropyxyz/entropy-js --save```

### Usage

```js
import Entropy from '@entropyxyz/entropy-js'

opts = {}

const entropy = new Entropy()

const address = entropy.keys.wallet.address

entropy.isRegistered(address)

entropy.register({
  keyVisibility: 'Permissioned',
  freeTx: false,
})

entropy

```

### Methods

#### constructor

