[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [signing](../modules/signing.md) / default

# Class: default

[signing](../modules/signing.md).default

`SignatureRequestManager` facilitates signature requests using Polkadot/Substrate API.
This manager handles transaction signing using pre-defined adapters and cryptographic utilities.

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
- [getTimeStamp](signing.default.md#gettimestamp)
- [pickValidators](signing.default.md#pickvalidators)
- [sign](signing.default.md#sign)
- [signTransaction](signing.default.md#signtransaction)
- [submitTransactionRequest](signing.default.md#submittransactionrequest)
- [verifyAndReduceSignatures](signing.default.md#verifyandreducesignatures)

## Constructors

### constructor

• **new default**(`config`): [`default`](signing.default.md)

Initializes a new instance of `SignatureRequestManager`.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | [`Config`](../interfaces/signing.Config.md) | Configuration settings for the manager. |

#### Returns

[`default`](signing.default.md)

#### Defined in

[signing/index.ts:61](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L61)

## Properties

### adapters

• **adapters**: `Object`

#### Index signature

▪ [key: `string` \| `number`]: [`Adapter`](../interfaces/signing_adapters_types.Adapter.md)

#### Defined in

[signing/index.ts:46](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L46)

___

### crypto

• **crypto**: [`CryptoLib`](../interfaces/utils_crypto.CryptoLib.md)

#### Defined in

[signing/index.ts:47](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L47)

___

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Defined in

[signing/index.ts:48](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L48)

___

### substrate

• **substrate**: `ApiPromise`

#### Defined in

[signing/index.ts:49](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L49)

## Methods

### formatTxRequests

▸ **formatTxRequests**(`params`): `Promise`\<[`EncMsg`](../interfaces/types.EncMsg.md)[]\>

Generates transaction requests formatted for validators.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Parameters for generating the transaction request. |
| `params.auxilaryData?` | `unknown`[] | Additional data for the transaction request. |
| `params.hash?` | `string` | The hash type. |
| `params.strippedsigRequestHash` | `string` | Stripped signature request hash. |
| `params.validatorsInfo` | [`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[] | Information about the validators. |

#### Returns

`Promise`\<[`EncMsg`](../interfaces/types.EncMsg.md)[]\>

A promise resolving to an array of encrypted messages for validators.

#### Defined in

[signing/index.ts:156](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L156)

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

[signing/index.ts:134](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L134)

___

### pickValidators

▸ **pickValidators**(`sigRequest`): `Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

Selects validators based on the signature request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigRequest` | `string` | The signature request hash. |

#### Returns

`Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

A promise resolving to an array of validator information.

#### Defined in

[signing/index.ts:247](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L247)

___

### sign

▸ **sign**(`sigOps`): `Promise`\<`Uint8Array`\>

Signs a given signature request hash.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigOps` | [`SigOps`](../interfaces/signing.SigOps.md) | Parameters for the signature operation. |

#### Returns

`Promise`\<`Uint8Array`\>

A promise resolving to the signed hash as a Uint8Array.

#### Defined in

[signing/index.ts:112](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L112)

___

### signTransaction

▸ **signTransaction**(`sigTxOps`): `Promise`\<`unknown`\>

Signs a transaction using the appropriate adapter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigTxOps` | [`SigTxOps`](../interfaces/signing.SigTxOps.md) | Parameters for the transaction signature operation. |

#### Returns

`Promise`\<`unknown`\>

A promise resolving with the signed transaction.

**`Throws`**

if an adapter for the transaction type is not found, or if the adapter lacks a preSign function.

#### Defined in

[signing/index.ts:81](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L81)

___

### submitTransactionRequest

▸ **submitTransactionRequest**(`txReq`): `Promise`\<`string`[][]\>

Sends transaction requests and retrieves the associated signatures.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `txReq` | [`EncMsg`](../interfaces/types.EncMsg.md)[] | An array of encrypted messages to send as transaction requests. |

#### Returns

`Promise`\<`string`[][]\>

A promise that resolves to an array of arrays of signatures in string format.

#### Defined in

[signing/index.ts:221](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L221)

___

### verifyAndReduceSignatures

▸ **verifyAndReduceSignatures**(`sigsAndProofs`): `Promise`\<`string`\>

Verifies and consolidates signatures received from validators.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigsAndProofs` | `string`[][] | Arrays of signatures and proofs. |

#### Returns

`Promise`\<`string`\>

The first valid signature after verification.

#### Defined in

[signing/index.ts:293](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L293)
