# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.


## Metadata 

To produce metadata and generate types, clone @entropy/core 

```
cargo build --release 
```

Now move the server and entropy binaries into @entropy/entropyjs, specifically the tests/testing-utils/test-binaries folder 

You'll now be able to run the following scripts to pull the necessary metadata and generate types. 

```
generate:pull:remote
build:generate
```

### Entropy

The `Entropy` class provides a high-level interface for interacting with Entropy.

```typescript
const entropyConfig: EntropyOpts = {
  seed: 'SEED_STRING', // Replace with your seed string
  endpoint: 'wss://SUBSTRATE_ENDPOINT', // Replace with your Substrate endpoint
  adapters: {
    // For example: ethereum: yourEthereumAdapterInstance
    // refer to signing/adapters/eth.ts for an example
  }
}

// initialize
const entropyInstance = new Entropy(entropyConfig)
```

### ExtrinsicBaseClass

The `ExtrinsicBaseClass` is a foundational class that provides methods to send extrinsics to Substrate.

```typescript
const substrate = new ApiPromise({ provider: new WsProvider('wss://SUBSTRATE_ENDPOINT') })
await substrate.isReady

const signer: Signer = {
  // Define your signer properties and methods here
  wallet: 'WALLET_INSTANCE', // Replace with your wallet instance or relevant signer properties
  // ... other signer properties and methods
}

const extrinsicBase = new ExtrinsicBaseClass({ substrate, signer })
```


### ProgramManager

The `ProgramManager` class interfaces with the V2 Entropy Constraints system (programs).

```typescript
const programManager = new ProgramManager({ substrate, signer })

programManager.get()
  .then((programBytecode) => {
    console.log('Program bytecode:', programBytecode)
  })
  .catch((error) => {
    console.error('Error retrieving program:', error)
  })

const programBytecode: ArrayBuffer = /* Your program's bytecode here */

programManager.set(programBytecode)
  .then(() => {
    console.log('Program set successfully!')
  })
  .catch((error) => {
    console.error('Error setting program:', error)
  })

```

### RegistrationManager

The `RegistrationManager` class manages user registration on Entropy.

```typescript
const registrationManager = new RegistrationManager({ substrate, signer })

const registrationParams: RegistrationParams = {
  freeTx: true,
  initialProgram: 'INITIAL_PROGRAM', // Replace with your initial program
  keyVisibility: 'Permissioned',
  address: 'USER_ADDRESS' // Replace with the user's address
}

registrationManager.register(registrationParams)
  .then(() => {
    console.log('User registered successfully!')
  })
  .catch((error) => {
    console.error('Error registering user:', error)
  })

const userAddress: Address = 'USER_ADDRESS' // Replace with the user's address

registrationManager.checkRegistrationStatus(userAddress)
  .then((isRegistered) => {
    if (isRegistered) {
      console.log('User is registered!')
    } else {
      console.log('User is not registered.')
    }
  })
  .catch((error) => {
    console.error('Error checking registration status:', error)
  })

```

### SignatureRequestManager

The `SignatureRequestManager` class manages signature requests on Entropy.

```typescript
const signatureRequestManager = new SignatureRequestManager({ signer, substrate, adapters, crypto: cryptoLib })

const txParams: TxParams = {
  // Define your transaction parameters here
  // ...
}

const sigTxOps: SigTxOps = {
  txParams,
  type: 'TYPE', // Replace with your type
  freeTx: true,
  retries: 3
}

signatureRequestManager.signTransaction(sigTxOps)
  .then((signature) => {
    console.log('Transaction signature:', signature)
  })
  .catch((error) => {
    console.error('Error signing transaction:', error)
  })

const sigOps: SigOps = {
  sigRequestHash: 'YOUR_SIG_REQUEST_HASH', // Replace with your sig request hash
  arch: 'YOUR_ARCH', // Replace with your architecture
  freeTx: true,
  retries: 3
}

signatureRequestManager.sign(sigOps)
  .then((signature) => {
    console.log('Request signature:', signature)
  })
  .catch((error) => {
    console.error('Error signing request:', error)
  })

```


## notes


### TODOS BEFORE JS DEV LAUNCH:

- [ ] Have functioning entropy lib
- [ ] documentation of all methods, functions and classes
- [ ] Passing existing tests (maybe mod them to fit new api)
- [ ] %80 code coverage also integrated with tests
- [ ] house cleaning:
  - [ ] delete old PR'S and branches that we no longer need
  - [ ] correctly type `any`s
  - [ ] delete `old` dir
  - remove unused deps

## BLOCKERS:
  - [ ] programs integrated into #entropy-core @jakehemmerle
  - [ ] dkg registration @JesseAbram
