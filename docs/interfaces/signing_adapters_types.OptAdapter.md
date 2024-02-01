[@entropyxyz/sdk](../README.md) / [Exports](../modules.md) / [signing/adapters/types](../modules/signing_adapters_types.md) / OptAdapter

# Interface: OptAdapter

[signing/adapters/types](../modules/signing_adapters_types.md).OptAdapter

## Table of contents

### Properties

- [arch](signing_adapters_types.OptAdapter.md#arch)
- [hash](signing_adapters_types.OptAdapter.md#hash)
- [postSign](signing_adapters_types.OptAdapter.md#postsign)
- [preSign](signing_adapters_types.OptAdapter.md#presign)
- [type](signing_adapters_types.OptAdapter.md#type)

## Properties

### arch

• `Optional` **arch**: [`Arch`](../enums/types.Arch.md)

#### Defined in

[signing/adapters/types.ts:13](https://github.com/entropyxyz/sdk/blob/1c426d7/src/signing/adapters/types.ts#L13)

___

### hash

• `Optional` **hash**: `string`

#### Defined in

[signing/adapters/types.ts:14](https://github.com/entropyxyz/sdk/blob/1c426d7/src/signing/adapters/types.ts#L14)

___

### postSign

• `Optional` **postSign**: (`sig`: `Uint8Array`) => `Promise`\<`unknown`\>

#### Type declaration

▸ (`sig`): `Promise`\<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `Uint8Array` |

##### Returns

`Promise`\<`unknown`\>

#### Defined in

[signing/adapters/types.ts:16](https://github.com/entropyxyz/sdk/blob/1c426d7/src/signing/adapters/types.ts#L16)

___

### preSign

• `Optional` **preSign**: (`sigReq`: [`TxParams`](signing.TxParams.md)) => `Promise`\<`string`\>

#### Type declaration

▸ (`sigReq`): `Promise`\<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sigReq` | [`TxParams`](signing.TxParams.md) |

##### Returns

`Promise`\<`string`\>

#### Defined in

[signing/adapters/types.ts:15](https://github.com/entropyxyz/sdk/blob/1c426d7/src/signing/adapters/types.ts#L15)

___

### type

• **type**: `string`

#### Defined in

[signing/adapters/types.ts:12](https://github.com/entropyxyz/sdk/blob/1c426d7/src/signing/adapters/types.ts#L12)
