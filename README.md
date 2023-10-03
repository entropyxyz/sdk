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
const entropy = new Entropy({ seed: 'YOUR_SEED', endpoint: 'YOUR_ENDPOINT' })
```

### ExtrinsicBaseClass

The `ExtrinsicBaseClass` is a foundational class that provides methods to send extrinsics to Substrate.


### ProgramManager

The `ProgramManager` class interfaces with the V2 Entropy Constraints system (programs).

```typescript
const programManager = new ProgramManager({ substrate: apiInstance, signer: signerInstance });
```

### RegistrationManager

The `RegistrationManager` class manages user registration on Entropy.

```typescript
const registrationManager = new RegistrationManager({ substrate: apiInstance, signer: signerInstance });
```

### SignatureRequestManager

The `SignatureRequestManager` class manages signature requests on Entropy.

```typescript
const signatureManager = new SignatureRequestManager({ signer: signerInstance, substrate: apiInstance, adapters: yourAdapters, crypto: CryptoLib })
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
