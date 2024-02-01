[@entropyxyz/sdk](../README.md) / [Exports](../modules.md) / [utils/crypto](../modules/utils_crypto.md) / CryptoLib

# Interface: CryptoLib

[utils/crypto](../modules/utils_crypto.md).CryptoLib

Interface for the cryptographic library, detailing core functionality: encryption, decryption, and key management.

**`See`**

[https://www.npmjs.com/package/@entropyxyz/entropy-protocol-nodejs](https://www.npmjs.com/package/@entropyxyz/entropy-protocol-nodejs)

## Table of contents

### Properties

- [decryptAndVerify](utils_crypto.CryptoLib.md#decryptandverify)
- [encryptAndSign](utils_crypto.CryptoLib.md#encryptandsign)
- [fromHex](utils_crypto.CryptoLib.md#fromhex)
- [publicKeyFromSecret](utils_crypto.CryptoLib.md#publickeyfromsecret)
- [verifySignature](utils_crypto.CryptoLib.md#verifysignature)

## Properties

### decryptAndVerify

• **decryptAndVerify**: (`secretKey`: `Uint8Array`, `msg`: `string`) => `Promise`\<`string`\>

Decrypts a provided message and verifies its authenticity.
Uses the provided secret key for decryption.

#### Type declaration

▸ (`secretKey`, `msg`): `Promise`\<`string`\>

Decrypts a provided message and verifies its authenticity.
Uses the provided secret key for decryption.

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretKey` | `Uint8Array` |
| `msg` | `string` |

##### Returns

`Promise`\<`string`\>

#### Defined in

[utils/crypto.ts:46](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L46)

___

### encryptAndSign

• **encryptAndSign**: (`secretKey`: `Uint8Array`, `encoded`: `Uint8Array`, `serverDHKey`: `Uint8Array`) => `Promise`\<`string`\>

Encrypts the provided message and signs it using the X25519 and ChaCha20Poly1305 algorithms.
Uses the provided secret key for encryption and the server's Diffie-Hellman (DH) key for the signature.

#### Type declaration

▸ (`secretKey`, `encoded`, `serverDHKey`): `Promise`\<`string`\>

Encrypts the provided message and signs it using the X25519 and ChaCha20Poly1305 algorithms.
Uses the provided secret key for encryption and the server's Diffie-Hellman (DH) key for the signature.

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretKey` | `Uint8Array` |
| `encoded` | `Uint8Array` |
| `serverDHKey` | `Uint8Array` |

##### Returns

`Promise`\<`string`\>

#### Defined in

[utils/crypto.ts:37](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L37)

___

### fromHex

• **fromHex**: (`input`: `string`) => `Uint8Array`

#### Type declaration

▸ (`input`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

##### Returns

`Uint8Array`

#### Defined in

[utils/crypto.ts:32](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L32)

___

### publicKeyFromSecret

• **publicKeyFromSecret**: (`secretKey`: `Uint8Array`) => `Promise`\<`Uint8Array`\>

Derives the public key from the provided secret key.

#### Type declaration

▸ (`secretKey`): `Promise`\<`Uint8Array`\>

Derives the public key from the provided secret key.

##### Parameters

| Name | Type |
| :------ | :------ |
| `secretKey` | `Uint8Array` |

##### Returns

`Promise`\<`Uint8Array`\>

#### Defined in

[utils/crypto.ts:50](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L50)

___

### verifySignature

• **verifySignature**: (`message`: `string`, `signature`: `string`, `address`: `string`) => `Promise`\<`boolean`\>

#### Type declaration

▸ (`message`, `signature`, `address`): `Promise`\<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `signature` | `string` |
| `address` | `string` |

##### Returns

`Promise`\<`boolean`\>

#### Defined in

[utils/crypto.ts:30](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L30)
