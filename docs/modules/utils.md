[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / utils

# Module: utils

## Table of contents

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

[utils/index.ts:133](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L133)

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

[utils/index.ts:129](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L129)

___

### getApi

▸ **getApi**(): `Promise`\<`ApiFactory`\>

#### Returns

`Promise`\<`ApiFactory`\>

#### Defined in

[utils/index.ts:30](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L30)

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

[utils/index.ts:139](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L139)

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

[utils/index.ts:161](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L161)

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

[utils/index.ts:156](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L156)

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

[utils/index.ts:147](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L147)

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

[utils/index.ts:11](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L11)

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

[utils/index.ts:90](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L90)

___

### sendHttpPost

▸ **sendHttpPost**(`url`, `data`): `Promise`\<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `data` | `string` |

#### Returns

`Promise`\<`string`\>

#### Defined in

[utils/index.ts:47](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L47)

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

[utils/index.ts:21](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L21)

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

[utils/index.ts:124](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L124)

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

[utils/index.ts:6](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L6)

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

[utils/index.ts:120](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/index.ts#L120)
