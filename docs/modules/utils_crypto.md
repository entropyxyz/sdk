[@entropyxyz/sdk](../README.md) / [Exports](../modules.md) / utils/crypto

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

[utils/crypto.ts:57](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L57)

___

### cryptoIsLoaded

• `Const` **cryptoIsLoaded**: `Promise`\<`void`\>

#### Defined in

[utils/crypto.ts:53](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L53)

## Functions

### loadCryptoLib

▸ **loadCryptoLib**(): `Promise`\<`any`\>

Dynamically loads the appropriate cryptographic library based on the runtime environment (Node.js or browser).

#### Returns

`Promise`\<`any`\>

The imported crypto library.

#### Defined in

[utils/crypto.ts:101](https://github.com/entropyxyz/sdk/blob/1c426d7/src/utils/crypto.ts#L101)
