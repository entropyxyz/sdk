[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / EntropyOpts

# Interface: EntropyOpts

[index](../modules/index.md).EntropyOpts

## Table of contents

### Properties

- [adapters](index.EntropyOpts.md#adapters)
- [endpoint](index.EntropyOpts.md#endpoint)
- [seed](index.EntropyOpts.md#seed)

## Properties

### adapters

• `Optional` **adapters**: `Object`

A collection of signing adapters.

#### Index signature

▪ [key: `string` \| `number`]: [`Adapter`](signing_adapters_types.Adapter.md)

#### Defined in

[index.ts:17](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L17)

___

### endpoint

• `Optional` **endpoint**: `string`

local or devnet endpoint for establishing a connection to validators

#### Defined in

[index.ts:15](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L15)

___

### seed

• `Optional` **seed**: `string`

seed for wallet initialization.

#### Defined in

[index.ts:13](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L13)
