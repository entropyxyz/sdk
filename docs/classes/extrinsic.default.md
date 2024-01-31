[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [extrinsic](../modules/extrinsic.md) / default

# Class: default

[extrinsic](../modules/extrinsic.md).default

A utility class to simplify extrinsic operations with the Polkadot/Substrate API.
Allows the user to send extrinsics and automatically handles errors, events, and certain special conditions like free transactions.

## Hierarchy

- **`default`**

  ↳ [`default`](programs_dev.default.md)

  ↳ [`default`](programs.default.md)

  ↳ [`default`](registration.default.md)

## Table of contents

### Constructors

- [constructor](extrinsic.default.md#constructor)

### Properties

- [signer](extrinsic.default.md#signer)
- [substrate](extrinsic.default.md#substrate)

### Methods

- [handleFreeTx](extrinsic.default.md#handlefreetx)
- [sendAndWaitFor](extrinsic.default.md#sendandwaitfor)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](extrinsic.default.md)

Initializes a new instance of the `ExtrinsicBaseClass`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `signer` | `any` |
| › `substrate` | `any` |

#### Returns

[`default`](extrinsic.default.md)

#### Defined in

[extrinsic/index.ts:30](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L30)

## Properties

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L20)

## Methods

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

#### Defined in

[extrinsic/index.ts:99](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L99)

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

#### Defined in

[extrinsic/index.ts:45](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L45)
