[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / signing/adapters/eth

# Module: signing/adapters/eth

## Table of contents

### Variables

- [arch](signing_adapters_eth.md#arch)
- [type](signing_adapters_eth.md#type)

### Functions

- [postSign](signing_adapters_eth.md#postsign)
- [preSign](signing_adapters_eth.md#presign)
- [pubToAddress](signing_adapters_eth.md#pubtoaddress)

## Variables

### arch

• `Const` **arch**: [`Evm`](../enums/types.Arch.md#evm) = `Arch.Evm`

#### Defined in

[signing/adapters/eth.ts:16](https://github.com/entropyxyz/entropy-js/blob/7732646/src/signing/adapters/eth.ts#L16)

___

### type

• `Const` **type**: ``"eth"``

#### Defined in

[signing/adapters/eth.ts:15](https://github.com/entropyxyz/entropy-js/blob/7732646/src/signing/adapters/eth.ts#L15)

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

[signing/adapters/eth.ts:11](https://github.com/entropyxyz/entropy-js/blob/7732646/src/signing/adapters/eth.ts#L11)

___

### preSign

▸ **preSign**(`txData`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `txData` | `any` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[signing/adapters/eth.ts:5](https://github.com/entropyxyz/entropy-js/blob/7732646/src/signing/adapters/eth.ts#L5)

___

### pubToAddress

▸ **pubToAddress**(`publicKey`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `string` |

#### Returns

`string`

#### Defined in

[signing/adapters/eth.ts:18](https://github.com/entropyxyz/entropy-js/blob/7732646/src/signing/adapters/eth.ts#L18)
