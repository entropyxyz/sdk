@entropyxyz/sdk / [Exports](modules.md)

# SDK

` @entropyxyz/sdk` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

![SDK](https://github.com/entropyxyz/sdk/assets/62079777/0d7e4684-bc89-48ee-8dc3-fefb25acc708)


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

## Table of contents

### Constructors

- [constructor](README.md#constructor)

### Properties

- [account](README.md#account)
- [ready](README.md#ready)
- [programManager](README.md#programs)
  - Flows:
    - [Dev](README.md#dev-example)
    - [User](README.md#user-example)
- [registrationManager](README.md#registrationmanager)

  - Methods:
    - [isRegistered](README.md#isregistered) - Checks if an address is already registered.
    - [getVerifyingKey](README.md#getverifyingkey) - Retrieves the verifying key for a registered address.
    - [register](README.md#register) - Registers an address with the necessary parameters.

- [signingManager](README.md#signingmanager)

  - Methods:
    - [sign](README.md#sign)
    - [signTransaction](README.md#signtransaction)

- [substrate](README.md#substrate)

## Constructors

• **new default**(`opts`): [`default`](./docs/classes/index.default.md)

Initializes an instance of the Entropy class.

#### Parameters

| Name   | Type                                                    | Description                                         |
| :----- | :------------------------------------------------------ | :-------------------------------------------------- |
| `opts` | [`EntropyOpts`](./docs/interfaces/index.EntropyOpts.md) | The configuration options for the Entropy instance. |

**`Example`**

```typescript
new Entropy({ account: entropyAccount })

await entropy.ready
```

#### Returns

[`default`](./docs/classes/index.default.md)

#### Defined in

[index.ts:83](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L83)

## Properties

### account

• `Optional` **account**: [`EntropyAccount`](./docs/interfaces/index.EntropyAccount.md)

**`Example`**

```typescript
export interface EntropyAccount {
  sigRequestKey?: Signer
  programModKey?: Signer | string
  programDeployKey?: Signer
  verifyingKey?: string
}
```

Here's an overview of what each field means.

sigRequestKey or 'Signing Key'is the account on the Entropy that is used to initate signing requests

programModKey or 'Program Modification Account' is the account on the Entropy chain which may update the programs for a particular user / organization / entity.

programDeployKey or 'Deploy Key' is the key used to deploy a program that can be used to remove a program

verifyingKey is the key verification key that corresponds to a signer.

For an overview of definitions read: [Terminology](https://github.com/entropyxyz/entropy-docs/blob/master/docs/02-Terminology.md)

#### Defined in

[index.ts:70](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L70)

---

### ready

• **ready**: `Promise`\<`boolean`\>

A promise that resolves once chacha20poly1305 cryptoLib has been loaded

#### Defined in

[index.ts:65](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L65)

---

### programManager

The ProgramManager provides interfaces to interact with Entropy Programs. It facilitates various operations such as retrieving, setting, adding, and removing programs associated with a user account.

Features
Alpha Release: This feature is currently in alpha and is subject to changes.
Dev and User Flows: Supports both development and user-level interactions with programs on the Entropy network.
Methods
constructor
Creates an instance of ProgramManager for interacting with Entropy programs.

```typescript
constructor({
  substrate: ApiPromise,
  programModKey: Signer,
  programDeployKey: Signer,
})
```

substrate: Instance of ApiPromise from @polkadot/api.
programModKey: Signer object for program modification.
programDeployKey: Optional signer object for deploying programs.

• **programs**: [`default`](programs.default.md)

There are two main flows for interfacing with Entropy Programs: dev and user.

A program can be deployed by anyone without having to register with Entropy first. After being deployed, the program then gets stored in the Programs storage slot with the key being a hash of(bytecode + configuration_interface). The hash is used by a user to point to the programs they want assigned to their key, everytime a program is referenced the ref counter increments.

Here's a deeper overview of programs: [programs](https://github.com/entropyxyz/entropy-docs/blob/master/docs/06-ProgramFeatures.md)

### **`Dev Example`**

```typescript
// to deploy a program

const pointer = await entropy.programs.dev.deploy('insert program bytecode')

// get a program bytecode

const fetchedProgram = await entropy.programs.dev.get('insert pointer hash')

// to remove a program

await entropy.programs.dev.remove('insert pointer hash')
```

### **`User Example`**

```typescript
// set a program to user list

await this.set(`pointer hash`, sigReqAccount, programModKey)

// get a list of user programs

await entropy.programs.get('user address')

// adds a program a list of user programs

await entropy.programs.add(
  'list of program hashes',
  sigReqAccount,
  programModKey
)

// removes a program a list of user programs

await entropy.programs.remove(
  'list of program hashes',
  sigReqAccount,
  programModKey
)
```

#### Defined in

[index.ts:68](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L68)

### registrationManager

• **registrationManager**: [`default`](registration.default.md)

#### Defined in

[index.ts:66](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L66)

### register

▸ **register**(`params`): `Promise`\<`void`\>

The user registers to Entropy by submitting a transaction from the 'signature request account' containing a 'program modification account', initial 'ProgramsData', and chosen key visibility mode.

ProgramsData - Is multiple Programs Instances. Which contain the program_pointer (the hash of the program you want to use) and the program_config for that program. On the evaluation of a signature request a threshold server will run all the programs and pass through the program config for that program.

The register method Registers an address with Entropy using the provided parameters.

for a more detail overview on registering read: [register](https://github.com/entropyxyz/entropy-docs/blob/master/docs/05-Register.md)

#### Parameters

| Name     | Type                                                                                                                                                         | Description                  |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- |
| `params` | [`RegistrationParams`](./docs/interfaces/registration.RegistrationParams.md) & { `account?`: [`EntropyAccount`](./docs/interfaces/index.EntropyAccount.md) } | The registration parameters. |

#### Returns

`Promise`\<`void`\>

A promise indicating the completion of the registration process.

**`Throws`**

- If the provided address format is incompatible.

**`Throws`**

- If the address is already registered or if there's a problem during registration.

**`Example`**

```typescript
// attempt user registration

await entropy.register({
  // insert address to specify ProgramModAccount
  keyVisibility: 'Permissioned',
  initialPrograms: [programData],
  programModAccount: '5Gw3s7q9...',
})
```

#### Defined in

[index.ts:186](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L186)

---

### isRegistered

• **isRegistered**: (`address`: [`Address`](./docs/modules/types.md#address)) => `Promise`\<`boolean`\>

#### Type declaration

▸ (`address`): `Promise`\<`boolean`\>

##### Parameters

| Name      | Type                                         |
| :-------- | :------------------------------------------- |
| `address` | [`Address`](./docs/modules/types.md#address) |

##### Returns

`Promise`\<`boolean`\>

**`Example`**

```typescript
await entropy.isRegistered(`insert address`)
```

#### Defined in

[index.ts:67](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L67)

---

### getVerifyingKey

▸ **getVerifyingKey**(`address`): `Promise`\<`string`\>

Retrieves the verifying key associated with the given address's registration record.

#### Parameters

| Name      | Type                                         | Description                                        |
| :-------- | :------------------------------------------- | :------------------------------------------------- |
| `address` | [`Address`](./docs/modules/types.md#address) | The address for which the verifying key is needed. |

#### Returns

`Promise`\<`string`\>

- A promise resolving to the verifying key.

**`Example`**

```typescript
const verifyingKey = await entropy.getVerifyingKey(address)
```

#### Defined in

[index.ts:215](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L215)

---

### signingManager

• **signingManager**: [`default`](signing.default.md)
**`Example`**

```typescript
// signing manager

await entropy.signingManager.sign({
  sigRequestHash,
  hash: this.adapters[type].hash,
  type,
})
```

#### Defined in

[index.ts:69](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L69)

### sign

▸ **sign**(`params`): `Promise`\<`Uint8Array`\>

Signs a signature request hash. This method involves various steps including validator
selection, transaction request formatting, and submission of these requests to validators
for signing. It returns the signature from the first validator after validation.

for a more detailed overview of signing read: [signing](https://github.com/entropyxyz/entropy-docs/blob/master/docs/08-Sign.md)

#### Parameters

| Name     | Type                                            | Description                         |
| :------- | :---------------------------------------------- | :---------------------------------- |
| `params` | [`SigOps`](./docs/interfaces/signing.SigOps.md) | The signature operation parameters. |

#### Returns

`Promise`\<`Uint8Array`\>

- A promise resolving to the signed hash as a Uint8Array.

**`Throws`**

- If there's an error in the signing routine.

**`Example`**

```typescript
// sign transaction

await entropy.signTransaction({ txParams: basicTx, type: 'eth' })
```

#### Defined in

[index.ts:259](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L259)

---

### signTransaction

▸ **signTransaction**(`params`): `Promise`\<`unknown`\>

Signs a given transaction based on the provided parameters.

The `signTransaction` method invokes the appropriate adapter (chain based configuration)
based on the type specified in the `params`. This modular approach ensures that various
transaction types can be supported. The method performs a series of operations, starting
with the `preSign` function of the selected adapter, followed by the actual signing of the
transaction request hash, and if necessary, the `postSign` function of the adapter.

#### Parameters

| Name     | Type                                                | Description                                 |
| :------- | :-------------------------------------------------- | :------------------------------------------ |
| `params` | [`SigTxOps`](./docs/interfaces/signing.SigTxOps.md) | The parameters for signing the transaction. |

#### Returns

`Promise`\<`unknown`\>

- A promise resolving to the transaction signature.

A promise that returns the transaction signature. Note that the structure
and format of this signature may differ based on the adapter.

**`Throws`**

- If no adapter is found for the specified transaction type.

**`Throws`**

Will throw an error if the transaction type does not have a corresponding adapter.

**`Example`**

```typescript
// signing manager

await entropy.signingManager.sign({
  sigRequestHash,
  hash: this.adapters[type].hash,
  type,
})
```

#### Defined in

[index.ts:240](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L240)

---

### substrate

• **substrate**: `ApiPromise`

**`Example`**

```typescript
// a simple get balance for user

const accountInfo = await entropy.substrate.query.system.account(address)

const freeBalance = hexToBigInt(accountInfo.data.free)

console.log(
  `Address ${
    selectedAccount.address
  } has a balance of: ${freeBalance.toString()} bits`
)
```

#### Defined in

[index.ts:71](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L71)
