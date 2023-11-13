[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [utils/crypto](../modules/utils_crypto.md) / CryptoLib

# Interface: CryptoLib

[utils/crypto](../modules/utils_crypto.md).CryptoLib

Interface for the cryptographic library, detailing core functionality: encryption, decryption, and key management.

**`See`**

[https://x25519-chacha20poly1305.vercel.app/x25519_chacha20poly1305/](https://x25519-chacha20poly1305.vercel.app/x25519_chacha20poly1305/)

## Table of contents

### Properties

- [decrypt\_and\_verify](utils_crypto.CryptoLib.md#decrypt_and_verify)
- [encrypt\_and\_sign](utils_crypto.CryptoLib.md#encrypt_and_sign)
- [from\_hex](utils_crypto.CryptoLib.md#from_hex)
- [public\_key\_from\_secret](utils_crypto.CryptoLib.md#public_key_from_secret)
- [verifySignature](utils_crypto.CryptoLib.md#verifysignature)

## Properties

### decrypt\_and\_verify

• **decrypt\_and\_verify**: (`secretKey`: `Uint8Array`, `msg`: `string`) => `Promise`\<`string`\>

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

[utils/crypto.ts:46](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/crypto.ts#L46)

___

### encrypt\_and\_sign

• **encrypt\_and\_sign**: (`secretKey`: `Uint8Array`, `encoded`: `Uint8Array`, `serverDHKey`: `Uint8Array`) => `Promise`\<`string`\>

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

[utils/crypto.ts:37](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/crypto.ts#L37)

___

### from\_hex

• **from\_hex**: (`input`: `string`) => `Uint8Array`

#### Type declaration

▸ (`input`): `Uint8Array`

##### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

##### Returns

`Uint8Array`

#### Defined in

[utils/crypto.ts:32](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/crypto.ts#L32)

___

### public\_key\_from\_secret

• **public\_key\_from\_secret**: (`secretKey`: `Uint8Array`) => `Promise`\<`Uint8Array`\>

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

[utils/crypto.ts:50](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/crypto.ts#L50)

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

[utils/crypto.ts:30](https://github.com/entropyxyz/entropy-js/blob/a7aaa0c/src/utils/crypto.ts#L30)