[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [registration](../modules/registration.md) / default

# Class: default

[registration](../modules/registration.md).default

The `RegistrationManager` class provides functionality for user registration using the Polkadot/Substrate API.
It extends the `ExtrinsicBaseClass` to handle extrinsic submissions and utility methods.

Includes registering a user, checking if a user is already registered, and listening for registration events.

## Hierarchy

- [`default`](extrinsic.default.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](registration.default.md#constructor)

### Properties

- [signer](registration.default.md#signer)
- [substrate](registration.default.md#substrate)

### Methods

- [checkRegistrationStatus](registration.default.md#checkregistrationstatus)
- [handleFreeTx](registration.default.md#handlefreetx)
- [register](registration.default.md#register)
- [sendAndWaitFor](registration.default.md#sendandwaitfor)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](registration.default.md)

Constructs a new instance of the `RegistrationManager` class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `signer` | [`Signer`](../interfaces/types.Signer.md) |
| › `substrate` | `ApiPromise` |

#### Returns

[`default`](registration.default.md)

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[registration/index.ts:39](https://github.com/entropyxyz/entropy-js/blob/368842b/src/registration/index.ts#L39)

## Properties

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Inherited from

[default](extrinsic.default.md).[signer](extrinsic.default.md#signer)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Inherited from

[default](extrinsic.default.md).[substrate](extrinsic.default.md#substrate)

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L20)

## Methods

### checkRegistrationStatus

▸ **checkRegistrationStatus**(`address`): `Promise`\<`boolean`\>

Verifies the registration status of an address.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](../modules/types.md#address) | The address for which registration status needs to be checked. |

#### Returns

`Promise`\<`boolean`\>

A promise which resolves to `true` if the address is registered, otherwise `false`.

#### Defined in

[registration/index.ts:125](https://github.com/entropyxyz/entropy-js/blob/368842b/src/registration/index.ts#L125)

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

[extrinsic/index.ts:99](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L99)

___

### register

▸ **register**(`«destructured»`): `Promise`\<[`RegisteredInfo`](../interfaces/registration.RegisteredInfo.md)\>

Registers a user with the given parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`RegistrationParams`](../interfaces/registration.RegistrationParams.md) |

#### Returns

`Promise`\<[`RegisteredInfo`](../interfaces/registration.RegisteredInfo.md)\>

A promise that resolves when the user is successfully registered.

**`Throws`**

If the user is already registered.

#### Defined in

[registration/index.ts:61](https://github.com/entropyxyz/entropy-js/blob/368842b/src/registration/index.ts#L61)

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

[extrinsic/index.ts:45](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L45)
