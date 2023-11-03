# entropy-js

DISCLAMER: VERSIONS OF ENTROPY-JS BEFORE VERSION 0.1.2 MAY HAVE BREAKING CHANGES BETWEEN VERSIONS THIS PROJECT IS UNSTABLE TILL THEN


`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.


### Instillation
yarn:
```yarn add @entropyxyz/entropy-js```

npm:
```npm i @entropyxyz/entropy-js --save```

### Usage

```js
import Entropy from '@entropyxyz/entropy-js'

// initialize entropy 

const seed = "SEED"
const endpoint = "endpoint"

const entropy = new Entropy({ seed, endpoint });
await entropy.ready;

```

### Methods
### Register

▸ **init**(address): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | Address |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[index.ts:47](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L47)

___

### register

▸ **register**(`params`): `Promise`\<`undefined`\>

Registers an address to Entropy using the provided parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`RegistrationParams`](./docs/interfaces/registration.RegistrationParams.md) |

#### Returns

`Promise`\<`undefined`\>

A promise indicating the completion of the registration process.

**`Throws`**

Throws if the provided address format is not compatible.

**`Throws`**

Throws if the address being registered is already in use.

#### Example(s)
```js

 const address = entropy.keys?.wallet.address
 console.log({ address });
  // Can do a pre-check to see if the address is registered 

 const isRegistered = await entropy.registrationManager.checkRegistrationStatus(address)
  // Register the address

 await entropy.register({
        address,
        keyVisibility: 'Permissioned',
        freeTx: false,
      })

  // check post-registration    

 const postRegistrationStatus = await entropy.isRegistered(address)
 ```     

#### Defined in

[index.ts:103](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L103)

___

### Methods

- [get](programs.default.md#get)
- [handleFreeTx](programs.default.md#handlefreetx)
- [sendAndWaitFor](programs.default.md#sendandwaitfor)
- [set](programs.default.md#set)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](programs.default.md)

Creates an instance of ProgramManager.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `signer` | [`Signer`](../interfaces/types.Signer.md) |
| › `substrate` | `ApiPromise` |

#### Returns

[`default`](programs.default.md)

**`Remarks`**

The constructor initializes the Substrate api and the signer.

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[programs/index.ts:22](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/programs/index.ts#L22)

## Properties

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Inherited from

[default](extrinsic.default.md).[signer](extrinsic.default.md#signer)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Inherited from

[default](extrinsic.default.md).[substrate](extrinsic.default.md#substrate)

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/extrinsic/index.ts#L20)

## Methods

### get

▸ **get**(`deployKey?`): `Promise`\<`ArrayBuffer`\>

Retrieves the program associated with a given deployKey (account)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `deployKey` | `string` | The account key, defaulting to the signer's wallet address if not provided. |

#### Returns

`Promise`\<`ArrayBuffer`\>

- The program as an ArrayBuffer.

**`Throws`**

If no program is defined for the given account.

**`Remarks`**

This method communicates with substrate to fetch bytecode associated with an account. 
The response is then processed and converted to an ArrayBuffer before being returned

#### Defined in

[programs/index.ts:39](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/programs/index.ts#L39)

___

### handleFreeTx

▸ **handleFreeTx**(`call`): `Promise`\<`SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\>\>

Prepares a free transaction, performs a dry run, and ensures its viability.

In this system:
- **Electricity** represents an energy unit allowing certain transactions to bypass traditional fees.
- An account's **Zaps** represent the available electricity it has. Consuming zaps results in transaction execution without fees.
- **Batteries** are rechargeable units in an account that generate zaps over time.

This method leverages the `callUsingElectricity` from the `freeTx` module to create a transaction that utilizes zaps.
A dry run is then performed to ensure its success when broadcasted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | The extrinsic intended for execution. |

#### Returns

`Promise`\<`SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\>\>

A promise resolving to a transaction prepared to use electricity.

**`Throws`**

If the dry run fails or there's insufficient electricity (zaps).

#### Inherited from

[default](extrinsic.default.md).[handleFreeTx](extrinsic.default.md#handlefreetx)

#### Defined in

[extrinsic/index.ts:99](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/extrinsic/index.ts#L99)

___

### sendAndWaitFor

▸ **sendAndWaitFor**(`call`, `freeTx?`, `filter`): `Promise`\<`EventRecord`\>

Sends an extrinsic and waits for a specific event or rejects with an error.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | `undefined` | The extrinsic call to send. |
| `freeTx` | `boolean` | `true` | Optional. Flag indicating if the transaction should be free (default: true). |
| `filter` | [`EventFilter`](../interfaces/types.EventFilter.md) | `undefined` | An event filter to wait for. |

#### Returns

`Promise`\<`EventRecord`\>

A promise that resolves with the filtered event record.

**`Throws`**

Will reject the promise if a dispatch error occurs or the filtered event is not found.

#### Inherited from

[default](extrinsic.default.md).[sendAndWaitFor](extrinsic.default.md#sendandwaitfor)

#### Defined in

[extrinsic/index.ts:45](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/extrinsic/index.ts#L45)

___

### set

▸ **set**(`program`): `Promise`\<`void`\>

Sets or updates a program for the current signer's account on Substrate.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | `ArrayBuffer` | The program to be set or updated, as an ArrayBuffer. |

#### Returns

`Promise`\<`void`\>

**`Throws`**

If there's an issue setting the program.

**`Remarks`**

This method takes a program in the form of an ArrayBuffer, converts it (so it can be passed to Substrate), and prepares a transaction to set or update the program 
for the associated account. After preparing the transaction, it's sent to Substrate, and the method waits for a confirmation event.


#### Examples(s)

```js
   // set program
 const userProgram: any = 
 await entropy.programs.set(userProgram);
 console.log("Program set successfully.");
   // get program
 const fetchedProgram: ArrayBuffer = await entropy.programs.get(entropy.keys?.wallet.address);
 const processedProgram = preprocessAfterGet(fetchedProgram);
 const processedProgramHex = buf2hex(processedProgram);
 console.log('Retrieved program (hex):', processedProgramHex);
```


#### Defined in

[programs/index.ts:63](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/programs/index.ts#L63)


### sign

▸ **sign**(`params`): `Promise`\<`Uint8Array`\>

The `sign` method is tasked with signing a `sigRequestHash`, which is essentially a hash of the
request that needs signing. It does so by obtaining validator information based on the hash,
formatting transaction requests for these validators, and then submitting these requests for the
validators to sign.

The process in detail:
1. The method removes any hex prefix from the request hash.
2. Determines a set of validators corresponding to the stripped request hash. These validators
   are tasked with validating and signing the transaction.
3. For each of these validators, the method constructs a transaction request. This request encompasses:
   - The stripped transaction request hash.
   - Information regarding all the chosen validators.
   - A timestamp.
4. Transaction requests are individually encrypted and signed for each validator using their respective public keys.
5. These encrypted and signed transaction requests are dispatched to the individual validators.
6. The method then awaits the validators' signatures on the requests.
7. Once received, the signature from the first validator is extracted and returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SigOps`](./docs/interfaces/signing.SigOps.md) | An object `sigRequestHash`, representing the hash of the request awaiting signature. |

#### Returns

`Promise`\<`Uint8Array`\>

A promise which, when resolved, produces a Uint8Array with the signature of the first validator.

**`Throws`**

Throws an error if there's an error at any stage in the signing routine.


#### Defined in

[index.ts:163](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L163)

___

### signTransaction

▸ **signTransaction**(`params`): `Promise`\<`unknown`\>

Signs a given transaction based on the provided parameters.

The `signTransaction` method invokes the appropriate adapter (chain based configuration)
based on the type specified in the `params`. This modular approach ensures that various
transaction types can be supported. The method performs a series of operations, starting
with the `preSign` function of the selected adapter, followed by the actual signing of the
transaction request hash, and if necessary, the `postSign` function of the adapter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SigTxOps`](./docs/interfaces/signing.SigTxOps.md) | An object that encapsulates all the required parameters for signing. |

#### Returns

`Promise`\<`unknown`\>

A promise that returns the transaction signature. Note that the structure
         and format of this signature may differ based on the adapter.

**`Throws`**

Will throw an error if the transaction type does not have a corresponding adapter.

#### Examples(s)

```js
  const signature: Uint8Array = await entropy.sign({
    sigRequestHash: serializedTx,
  })

```

#### Defined in

[index.ts:132](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L132)
