[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / utils

# Module: utils

## Table of contents

### Interfaces

- [AnyObject](../interfaces/utils.AnyObject.md)

### Functions

- [buf2hex](utils.md#buf2hex)
- [decodeArrayBufferToString](utils.md#decodearraybuffertostring)
- [getApi](utils.md#getapi)
- [hex2buf](utils.md#hex2buf)
- [hexStringToIntArray](utils.md#hexstringtointarray)
- [hexToBase64](utils.md#hextobase64)
- [hexToBase64remove](utils.md#hextobase64remove)
- [isValidSubstrateAddress](utils.md#isvalidsubstrateaddress)
- [readKey](utils.md#readkey)
- [sendHttpPost](utils.md#sendhttppost)
- [sleep](utils.md#sleep)
- [stringToU8Array](utils.md#stringtou8array)
- [stripHexPrefix](utils.md#striphexprefix)
- [u8ArrayToString](utils.md#u8arraytostring)

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

[utils/index.ts:137](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L137)

___

### decodeArrayBufferToString

▸ **decodeArrayBufferToString**(`buf`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `buf` | `ArrayBuffer` |

#### Returns

`string`

#### Defined in

[utils/index.ts:133](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L133)

___

### getApi

▸ **getApi**(): `Promise`\<`ApiFactory`\>

#### Returns

`Promise`\<`ApiFactory`\>

#### Defined in

[utils/index.ts:34](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L34)

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

[utils/index.ts:143](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L143)

___

### hexStringToIntArray

▸ **hexStringToIntArray**(`hexString`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `hexString` | `string` |

#### Returns

`number`[]

#### Defined in

[utils/index.ts:165](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L165)

___

### hexToBase64

▸ **hexToBase64**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[utils/index.ts:160](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L160)

___

### hexToBase64remove

▸ **hexToBase64remove**(`str`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`string`

#### Defined in

[utils/index.ts:151](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L151)

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

[utils/index.ts:15](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L15)

___

### readKey

▸ **readKey**(`path`): `Promise`\<`Uint8Array`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `path` | `string` |

#### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[utils/index.ts:94](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L94)

___

### sendHttpPost

▸ **sendHttpPost**(`url`, `data`): `Promise`\<`string`[] \| `string` \| [`AnyObject`](../interfaces/utils.AnyObject.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data` | `string` |

#### Returns

`Promise`\<`string`[] \| `string` \| [`AnyObject`](../interfaces/utils.AnyObject.md)\>

#### Defined in

[utils/index.ts:51](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L51)

___

### sleep

▸ **sleep**(`delay`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `delay` | `number` |

#### Returns

`void`

#### Defined in

[utils/index.ts:25](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L25)

___

### stringToU8Array

▸ **stringToU8Array**(`str`): `Uint8Array`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`Uint8Array`

#### Defined in

[utils/index.ts:128](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L128)

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

[utils/index.ts:10](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L10)

___

### u8ArrayToString

▸ **u8ArrayToString**(`array`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `array` | `Uint8Array` |

#### Returns

`string`

#### Defined in

[utils/index.ts:124](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/index.ts#L124)
