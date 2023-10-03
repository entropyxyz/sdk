# Entropy Blockchain Interaction Library

This library provides a set of classes and utilities to interact with Entropy. It covers functionalities like registration, program management, signature requests, and more.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Entropy](#entropy)
  - [ExtrinsicBaseClass](#extrinsicbaseclass)
  - [ProgramManager](#programmanager)
  - [RegistrationManager](#registrationmanager)
  - [SignatureRequestManager](#signaturerequestmanager)


## Metadata 

To produce metadata and generate types, clone @entropy/core 

\```
cargo build --release 
\```

Now move the server and entropy binaries into @entropy/entropyjs, specifically the tests/testing-utils/test-binaries folder 

You'll now be able to run the following scripts to pull the necessary metadata and generate types. 

\```
generate:pull:remote
build:generate
\```

### Entropy

The `Entropy` class provides a high-level interface for interacting with Entropy.

\```typescript
const entropy = new Entropy({ seed: 'YOUR_SEED', endpoint: 'YOUR_ENDPOINT' });
\```

### ExtrinsicBaseClass

The `ExtrinsicBaseClass` is a foundational class that provides methods to send extrinsics to the Substrate blockchain.


### ProgramManager

The `ProgramManager` class interfaces with the V2 Entropy Constraints system (programs).

\```typescript
const programManager = new ProgramManager({ substrate: apiInstance, signer: signerInstance });
\```

### RegistrationManager

The `RegistrationManager` class manages user registration on Entropy .

\```typescript
const registrationManager = new RegistrationManager({ substrate: apiInstance, signer: signerInstance });
\```

### SignatureRequestManager

The `SignatureRequestManager` class manages signature requests on Entropy.

\```typescript
const signatureManager = new SignatureRequestManager({ signer: signerInstance, substrate: apiInstance, adapters: yourAdapters, crypto: CryptoLib });
\```

