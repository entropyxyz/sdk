[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / signing/adapters/eth

# Module: signing/adapters/eth

## Table of contents

### Variables

- [arch](signing_adapters_eth.md#arch)
- [type](signing_adapters_eth.md#type)

### Functions

- [postSign](signing_adapters_eth.md#postsign)
- [preSign](signing_adapters_eth.md#presign)

## Variables

### arch

• `Const` **arch**: [`Evm`](../enums/types.Arch.md#evm) = `Arch.Evm`

#### Defined in

[signing/adapters/eth.ts:17](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/adapters/eth.ts#L17)

___

### type

• `Const` **type**: ``"eth"``

#### Defined in

[signing/adapters/eth.ts:16](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/adapters/eth.ts#L16)

## Functions

### postSign

▸ **postSign**(`sig`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sig` | `Uint8Array` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[signing/adapters/eth.ts:11](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/adapters/eth.ts#L11)

___

### preSign

▸ **preSign**(`tx`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `tx` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[signing/adapters/eth.ts:4](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/signing/adapters/eth.ts#L4)
