[@entropyxyz/sdk](../README.md) / [Exports](../modules.md) / [programs/dev](../modules/programs_dev.md) / default

# Class: default

[programs/dev](../modules/programs_dev.md).default

Class to handle program-related extrinsic functions.

## Hierarchy

- [`default`](extrinsic.default.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](programs_dev.default.md#constructor)

### Properties

- [signer](programs_dev.default.md#signer)
- [substrate](programs_dev.default.md#substrate)

### Methods

- [deploy](programs_dev.default.md#deploy)
- [get](programs_dev.default.md#get)
- [handleFreeTx](programs_dev.default.md#handlefreetx)
- [remove](programs_dev.default.md#remove)
- [sendAndWaitFor](programs_dev.default.md#sendandwaitfor)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](programs_dev.default.md)

Constructs a ProgramDev instance.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `signer` | [`Signer`](../interfaces/types.Signer.md) |
| › `substrate` | `ApiPromise` |

#### Returns

[`default`](programs_dev.default.md)

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[programs/dev.ts:38](https://github.com/entropyxyz/sdk/blob/1c426d7/src/programs/dev.ts#L38)

## Properties

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Inherited from

[default](extrinsic.default.md).[signer](extrinsic.default.md#signer)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/sdk/blob/1c426d7/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Inherited from

[default](extrinsic.default.md).[substrate](extrinsic.default.md#substrate)

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/sdk/blob/1c426d7/src/extrinsic/index.ts#L20)

## Methods

### deploy

▸ **deploy**(`program`, `configurationInterface?`): `Promise`\<`string`\>

Deploys a new program.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | `ArrayBuffer` | The program to deploy. |
| `configurationInterface?` | `unknown` | Optional. The configuration interface of the program. |

#### Returns

`Promise`\<`string`\>

- A Promise resolving to the hash of the deployed program.

#### Defined in

[programs/dev.ts:72](https://github.com/entropyxyz/sdk/blob/1c426d7/src/programs/dev.ts#L72)

___

### get

▸ **get**(`pointer`): `Promise`\<[`ProgramInfo`](../interfaces/programs_dev.ProgramInfo.md)\>

Retrieves program information using a program pointer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pointer` | `string` | The program pointer. |

#### Returns

`Promise`\<[`ProgramInfo`](../interfaces/programs_dev.ProgramInfo.md)\>

- A Promise resolving to the program information.

#### Defined in

[programs/dev.ts:55](https://github.com/entropyxyz/sdk/blob/1c426d7/src/programs/dev.ts#L55)

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

[extrinsic/index.ts:99](https://github.com/entropyxyz/sdk/blob/1c426d7/src/extrinsic/index.ts#L99)

___

### remove

▸ **remove**(`programHash`): `Promise`\<`void`\>

Removes a program.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `programHash` | `string` \| `Uint8Array` | The hash of the program to remove. |

#### Returns

`Promise`\<`void`\>

- A Promise resolving when the program is removed.

#### Defined in

[programs/dev.ts:101](https://github.com/entropyxyz/sdk/blob/1c426d7/src/programs/dev.ts#L101)

___

### sendAndWaitFor

▸ **sendAndWaitFor**(`call`, `freeTx?`, `filter`): `Promise`\<`EventRecord`\>

Sends an extrinsic and waits for a specific event or rejects with an error.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | `undefined` | The extrinsic call to send. |
| `freeTx` | `boolean` | `false` | Optional. Flag indicating if the transaction should be free (default: false). |
| `filter` | [`EventFilter`](../interfaces/types.EventFilter.md) | `undefined` | An event filter to wait for. |

#### Returns

`Promise`\<`EventRecord`\>

A promise that resolves with the filtered event record.

**`Throws`**

Will reject the promise if a dispatch error occurs or the filtered event is not found.

#### Inherited from

[default](extrinsic.default.md).[sendAndWaitFor](extrinsic.default.md#sendandwaitfor)

#### Defined in

[extrinsic/index.ts:45](https://github.com/entropyxyz/sdk/blob/1c426d7/src/extrinsic/index.ts#L45)
