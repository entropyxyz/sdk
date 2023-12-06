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

[utils/index.ts:149](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L149)

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

[utils/index.ts:145](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L145)

___

### getApi

▸ **getApi**(): `Promise`\<`ApiFactory`\>

#### Returns

`Promise`\<`ApiFactory`\>

#### Defined in

[utils/index.ts:46](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L46)

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

[utils/index.ts:155](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L155)

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

[utils/index.ts:177](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L177)

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

[utils/index.ts:172](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L172)

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

[utils/index.ts:163](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L163)

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

[utils/index.ts:16](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L16)

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

[utils/index.ts:10](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L10)

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

[utils/index.ts:27](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L27)

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

[utils/index.ts:106](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L106)

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

[utils/index.ts:63](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L63)

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

[utils/index.ts:37](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L37)

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

[utils/index.ts:140](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L140)

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

[utils/index.ts:22](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L22)

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

[utils/index.ts:136](https://github.com/entropyxyz/entropy-js/blob/368842b/src/utils/index.ts#L136)
