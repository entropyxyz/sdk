[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / keys

# Module: keys

## Table of contents

### Functions

- [getWallet](keys.md#getwallet)
- [isValidPair](keys.md#isvalidpair)
- [mnemonicGenOrDerive](keys.md#mnemonicgenorderive)

## Functions

### getWallet

▸ **getWallet**(`pair`): `Promise`\<\{ `pair`: [`Signer`](../interfaces/types.Signer.md) ; `wallet`: `KeyringPair`  }\>

Retrieves a wallet from a `Signer` object or a seed string.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pair` | `string` \| [`Signer`](../interfaces/types.Signer.md) | A `Signer` object or a seed string. |

#### Returns

`Promise`\<\{ `pair`: [`Signer`](../interfaces/types.Signer.md) ; `wallet`: `KeyringPair`  }\>

A Promise resolving to an object containing the wallet and its associated `Signer`, or undefined if the input is invalid.

#### Defined in

[keys/index.ts:74](https://github.com/entropyxyz/entropy-js/blob/7732646/src/keys/index.ts#L74)

___

### isValidPair

▸ **isValidPair**(`pair`): `boolean`

Checks if the provided object is a valid `Signer` pair.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pair` | [`Signer`](../interfaces/types.Signer.md) | The `Signer` object to be validated. |

#### Returns

`boolean`

A boolean indicating whether the provided object is a valid `Signer` pair.

#### Defined in

[keys/index.ts:21](https://github.com/entropyxyz/entropy-js/blob/7732646/src/keys/index.ts#L21)

___

### mnemonicGenOrDerive

▸ **mnemonicGenOrDerive**(`mnemonic?`, `derivationPath?`): `Promise`\<[`Signer`](../interfaces/types.Signer.md)\>

Generates a new mnemonic phrase or derives a wallet from an existing mnemonic and an optional derivation path.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mnemonic?` | `string` | Optional. The mnemonic phrase to derive the wallet from. If not provided, a new one is generated. |
| `derivationPath?` | `string` | Optional. The derivation path to use with the provided mnemonic. |

#### Returns

`Promise`\<[`Signer`](../interfaces/types.Signer.md)\>

A Promise resolving to a `Signer` object containing the generated or derived wallet and its associated key pair.

#### Defined in

[keys/index.ts:84](https://github.com/entropyxyz/entropy-js/blob/7732646/src/keys/index.ts#L84)
