[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / utils

# Module: utils

## Table of contents

### Interfaces

- [AnyObject](../interfaces/utils.AnyObject.md)

### Functions

- [buf2hex](utils.md#buf2hex)
- [hex2buf](utils.md#hex2buf)
- [isValidSubstrateAddress](utils.md#isvalidsubstrateaddress)
- [sendHttpPost](utils.md#sendhttppost)
- [stripHexPrefix](utils.md#striphexprefix)
- [typeofthing](utils.md#typeofthing)

## Functions

### buf2hex

▸ **buf2hex**(`buffer`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buffer` | `ArrayBuffer` |

#### Returns

`string`

#### Defined in

[utils/index.ts:79](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L79)

___

### hex2buf

▸ **hex2buf**(`hex`): `ArrayBuffer`

#### Parameters

| Name | Type |
| :------ | :------ |
| `hex` | `string` |

#### Returns

`ArrayBuffer`

#### Defined in

[utils/index.ts:85](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L85)

___

### isValidSubstrateAddress

▸ **isValidSubstrateAddress**(`address`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](types.md#address) |

#### Returns

`boolean`

#### Defined in

[utils/index.ts:26](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L26)

___

### sendHttpPost

▸ **sendHttpPost**(`url`, `data`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data` | `any` |

#### Returns

`Promise`\<`any`\>

#### Defined in

[utils/index.ts:36](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L36)

___

### stripHexPrefix

▸ **stripHexPrefix**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[utils/index.ts:21](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L21)

___

### typeofthing

▸ **typeofthing**(`thing`): ``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"symbol"`` \| ``"undefined"`` \| ``"object"`` \| ``"function"`` \| ``"array"`` \| ``"null"``

#### Parameters

| Name | Type |
| :------ | :------ |
| `thing` | `any` |

#### Returns

``"string"`` \| ``"number"`` \| ``"bigint"`` \| ``"boolean"`` \| ``"symbol"`` \| ``"undefined"`` \| ``"object"`` \| ``"function"`` \| ``"array"`` \| ``"null"``

#### Defined in

[utils/index.ts:9](https://github.com/entropyxyz/SDK/blob/1c426d7/src/utils/index.ts#L9)
