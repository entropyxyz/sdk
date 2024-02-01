[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [signing](../modules/signing.md) / UserSignatureRequest

# Interface: UserSignatureRequest

[signing](../modules/signing.md).UserSignatureRequest

## Table of contents

### Properties

- [auxilary\_data](signing.UserSignatureRequest.md#auxilary_data)
- [hash](signing.UserSignatureRequest.md#hash)
- [message](signing.UserSignatureRequest.md#message)
- [timestamp](signing.UserSignatureRequest.md#timestamp)
- [validators\_info](signing.UserSignatureRequest.md#validators_info)

## Properties

### auxilary\_data

• `Optional` **auxilary\_data**: `string`[]

#### Defined in

[signing/index.ts:35](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L35)

___

### hash

• **hash**: `string`

#### Defined in

[signing/index.ts:38](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L38)

___

### message

• **message**: `string`

#### Defined in

[signing/index.ts:34](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L34)

___

### timestamp

• **timestamp**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `nanos_since_epoch` | `number` |
| `secs_since_epoch` | `number` |

#### Defined in

[signing/index.ts:37](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L37)

___

### validators\_info

• **validators\_info**: [`ValidatorInfo`](types.ValidatorInfo.md)[]

#### Defined in

[signing/index.ts:36](https://github.com/entropyxyz/SDK/blob/1c426d7/src/signing/index.ts#L36)
