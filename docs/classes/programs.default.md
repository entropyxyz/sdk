[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [programs](../modules/programs.md) / default

# Class: default

[programs](../modules/programs.md).default

**`Remarks`**

The ProgramManager class provides an interface to interact with the V2 Entropy Programs.

## Hierarchy

- [`default`](extrinsic.default.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](programs.default.md#constructor)

### Properties

- [signer](programs.default.md#signer)
- [substrate](programs.default.md#substrate)

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

#### Defined in

[programs/index.ts:63](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/programs/index.ts#L63)
