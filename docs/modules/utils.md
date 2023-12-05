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
- [isHexSee](utils.md#ishexsee)
- [isPublicKey](utils.md#ispublickey)
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

[utils/index.ts:150](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L150)

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

[utils/index.ts:146](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L146)

___

### getApi

▸ **getApi**(): `Promise`\<`ApiFactory`\>

#### Returns

`Promise`\<`ApiFactory`\>

#### Defined in

[utils/index.ts:47](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L47)

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

[utils/index.ts:156](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L156)

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

[utils/index.ts:178](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L178)

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

[utils/index.ts:173](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L173)

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

[utils/index.ts:164](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L164)

___

### isHexSee

▸ **isHexSee**(`str`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/index.ts:16](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L16)

___

### isPublicKey

▸ **isPublicKey**(`str`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `str` | `string` |

#### Returns

`boolean`

#### Defined in

[utils/index.ts:10](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L10)

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

[utils/index.ts:28](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L28)

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

[utils/index.ts:107](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L107)

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

[utils/index.ts:64](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L64)

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

[utils/index.ts:38](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L38)

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

[utils/index.ts:141](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L141)

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

[utils/index.ts:23](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L23)

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

[utils/index.ts:137](https://github.com/entropyxyz/entropy-js/blob/7732646/src/utils/index.ts#L137)
