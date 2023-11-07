[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [signing](../modules/signing.md) / default

# Class: default

[signing](../modules/signing.md).default

`SignatureRequestManager` facilitates signature requests using Polkadot/Substrate API.
This manager handles transaction signing using pre-defined adapters and cryptographic utilities.

## Hierarchy

- [`default`](extrinsic.default.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](signing.default.md#constructor)

### Properties

- [adapters](signing.default.md#adapters)
- [crypto](signing.default.md#crypto)
- [signer](signing.default.md#signer)
- [substrate](signing.default.md#substrate)

### Methods

- [formatTxRequests](signing.default.md#formattxrequests)
- [getArbitraryValidators](signing.default.md#getarbitraryvalidators)
- [getTimeStamp](signing.default.md#gettimestamp)
- [handleFreeTx](signing.default.md#handlefreetx)
- [sendAndWaitFor](signing.default.md#sendandwaitfor)
- [sign](signing.default.md#sign)
- [signTransaction](signing.default.md#signtransaction)
- [submitTransactionRequest](signing.default.md#submittransactionrequest)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](signing.default.md)

Constructs a new instance of the `SignatureRequestManager` class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`Config`](../interfaces/signing.Config.md) |

#### Returns

[`default`](signing.default.md)

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[signing/index.ts:51](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L51)

## Properties

### adapters

• **adapters**: `Object`

#### Index signature

▪ [key: `string` \| `number`]: [`Adapter`](../interfaces/signing_adapters_types.Adapter.md)

#### Defined in

[signing/index.ts:39](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L39)

___

### crypto

• **crypto**: [`CryptoLib`](../interfaces/utils_crypto.CryptoLib.md)

#### Defined in

[signing/index.ts:40](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L40)

___

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

### formatTxRequests

▸ **formatTxRequests**(`«destructured»`): `Promise`\<[`EncMsg`](../interfaces/types.EncMsg.md)[]\>

Generates formatted transaction requests suitable for validators.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `strippedsigRequestHash` | `string` |
| › `validatorsInfo` | [`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[] |

#### Returns

`Promise`\<[`EncMsg`](../interfaces/types.EncMsg.md)[]\>

A promise that resolves to an array of encrypted messages for each validator.

#### Defined in

[signing/index.ts:135](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L135)

___

### getArbitraryValidators

▸ **getArbitraryValidators**(`sigRequest`): `Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

Fetches validator information based on the signature request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigRequest` | `string` | The provided signature request. |

#### Returns

`Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

A promise that resolves to an array of information related to validators.

#### Defined in

[signing/index.ts:219](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L219)

___

### getTimeStamp

▸ **getTimeStamp**(): `Object`

Retrieves the current timestamp split into seconds and nanoseconds.

#### Returns

`Object`

An object containing `secs_since_epoch` and `nanos_since_epoch`.

| Name | Type |
| :------ | :------ |
| `nanos_since_epoch` | `number` |
| `secs_since_epoch` | `number` |

#### Defined in

[signing/index.ts:116](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L116)

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

### sign

▸ **sign**(`sigRequestHash`): `Promise`\<`Uint8Array`\>

Signs the provided request hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigRequestHash` | [`SigOps`](../interfaces/signing.SigOps.md) | The request hash to sign. |

#### Returns

`Promise`\<`Uint8Array`\>

A promise which resolves to the generated signature as a Uint8Array.

#### Defined in

[signing/index.ts:95](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L95)

___

### signTransaction

▸ **signTransaction**(`«destructured»`): `Promise`\<`unknown`\>

Signs a transaction of the specified type.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`SigTxOps`](../interfaces/signing.SigTxOps.md) |

#### Returns

`Promise`\<`unknown`\>

A promise that resolves with the signed transaction.

**`Throws`**

If an adapter for the given transaction type is not found.

#### Defined in

[signing/index.ts:69](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L69)

___

### submitTransactionRequest

▸ **submitTransactionRequest**(`txReq`): `Promise`\<`string`[]\>

Sends transaction requests and retrieves the associated signatures.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txReq` | [`EncMsg`](../interfaces/types.EncMsg.md)[] | An array of encrypted messages to send as transaction requests. |

#### Returns

`Promise`\<`string`[]\>

A promise that resolves to an array of signatures in string format.

#### Defined in

[signing/index.ts:194](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/signing/index.ts#L194)
