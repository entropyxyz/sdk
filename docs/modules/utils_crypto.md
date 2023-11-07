[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / utils/crypto

# Module: utils/crypto

## Table of contents

### Interfaces

- [CryptoLib](../interfaces/utils_crypto.CryptoLib.md)

### Variables

- [crypto](utils_crypto.md#crypto)
- [cryptoIsLoaded](utils_crypto.md#cryptoisloaded)

### Functions

- [loadCryptoLib](utils_crypto.md#loadcryptolib)

## Variables

### crypto

• `Const` **crypto**: [`CryptoLib`](../interfaces/utils_crypto.CryptoLib.md)

#### Defined in

[utils/crypto.ts:51](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/crypto.ts#L51)

___

### cryptoIsLoaded

• `Const` **cryptoIsLoaded**: `Promise`\<`void`\>

#### Defined in

[utils/crypto.ts:47](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/crypto.ts#L47)

## Functions

### loadCryptoLib

▸ **loadCryptoLib**(): `Promise`\<`any`\>

Dynamically loads the appropriate cryptographic library based on the runtime environment (Node.js or browser).

#### Returns

`Promise`\<`any`\>

The imported crypto library.

#### Defined in

[utils/crypto.ts:75](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/utils/crypto.ts#L75)
