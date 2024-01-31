[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [signing/adapters/types](../modules/signing_adapters_types.md) / Adapter

# Interface: Adapter

[signing/adapters/types](../modules/signing_adapters_types.md).Adapter

## Table of contents

### Properties

- [arch](signing_adapters_types.Adapter.md#arch)
- [hash](signing_adapters_types.Adapter.md#hash)
- [postSign](signing_adapters_types.Adapter.md#postsign)
- [preSign](signing_adapters_types.Adapter.md#presign)
- [type](signing_adapters_types.Adapter.md#type)

## Properties

### arch

• **arch**: [`Arch`](../enums/types.Arch.md)

#### Defined in

[signing/adapters/types.ts:5](https://github.com/entropyxyz/SDK/blob/04833ee/src/signing/adapters/types.ts#L5)

___

### hash

• **hash**: `string`

#### Defined in

[signing/adapters/types.ts:6](https://github.com/entropyxyz/SDK/blob/04833ee/src/signing/adapters/types.ts#L6)

___

### postSign

• **postSign**: (`sig`: `Uint8Array`) => `Promise`\<`unknown`\>

#### Type declaration

▸ (`sig`): `Promise`\<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `Uint8Array` |

##### Returns

`Promise`\<`unknown`\>

#### Defined in

[signing/adapters/types.ts:8](https://github.com/entropyxyz/SDK/blob/04833ee/src/signing/adapters/types.ts#L8)

___

### preSign

• **preSign**: (`sigReq`: [`TxParams`](signing.TxParams.md)) => `Promise`\<`string`\>

#### Type declaration

▸ (`sigReq`): `Promise`\<`string`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `sigReq` | [`TxParams`](signing.TxParams.md) |

##### Returns

`Promise`\<`string`\>

#### Defined in

[signing/adapters/types.ts:7](https://github.com/entropyxyz/SDK/blob/04833ee/src/signing/adapters/types.ts#L7)

___

### type

• **type**: `string`

#### Defined in

[signing/adapters/types.ts:4](https://github.com/entropyxyz/SDK/blob/04833ee/src/signing/adapters/types.ts#L4)
