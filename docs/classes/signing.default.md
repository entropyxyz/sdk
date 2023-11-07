[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [signing](../modules/signing.md) / default

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

• **new default**(`«destructured»`): [`default`](signing.default.md)

Constructs a new instance of the `SignatureRequestManager` class.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`Config`](../interfaces/signing.Config.md) |

#### Returns

[`default`](signing.default.md)

#### Defined in

[signing/index.ts:51](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L51)

## Properties

### adapters

• **adapters**: `Object`

#### Index signature

▪ [key: `string` \| `number`]: [`Adapter`](../interfaces/signing_adapters_types.Adapter.md)

#### Defined in

[signing/index.ts:37](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L37)

___

### crypto

• **crypto**: [`CryptoLib`](../interfaces/utils_crypto.CryptoLib.md)

#### Defined in

[signing/index.ts:38](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L38)

___

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Defined in

[signing/index.ts:39](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L39)

___

### substrate

• **substrate**: `ApiPromise`

#### Defined in

[signing/index.ts:40](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L40)

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

[signing/index.ts:136](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L136)

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

[signing/index.ts:117](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L117)

___

### pickValidators

▸ **pickValidators**(`sigRequest`): `Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

Fetches validator information based on the signature request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigRequest` | `string` | The provided signature request. |

#### Returns

`Promise`\<[`ValidatorInfo`](../interfaces/types.ValidatorInfo.md)[]\>

A promise that resolves to an array of information related to validators.

#### Defined in

[signing/index.ts:221](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L221)

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

[signing/index.ts:96](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L96)

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

[signing/index.ts:70](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L70)

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

[signing/index.ts:196](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L196)

___

### verifyAndReduceSignatures

▸ **verifyAndReduceSignatures**(`sigsAndProofs`): `Promise`\<`string`\>

Verifies the signatures from the tss_nodes

#### Parameters

| Name | Type |
| :------ | :------ |
| `sigsAndProofs` | `string`[][] |

#### Returns

`Promise`\<`string`\>

string - the first valid signature

#### Defined in

[signing/index.ts:266](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/index.ts#L266)
