[@entropyxyz/sdk](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / EntropyOpts

# Interface: EntropyOpts

[index](../modules/index.md).EntropyOpts

## Table of contents

### Properties

- [account](index.EntropyOpts.md#account)
- [adapters](index.EntropyOpts.md#adapters)
- [endpoint](index.EntropyOpts.md#endpoint)

## Properties

### account

• `Optional` **account**: [`EntropyAccount`](index.EntropyAccount.md)

account for wallet initialization.

#### Defined in

[index.ts:20](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L20)

___

### adapters

• `Optional` **adapters**: `Object`

A collection of signing adapters.

#### Index signature

▪ [key: `string` \| `number`]: [`Adapter`](signing_adapters_types.Adapter.md)

#### Defined in

[index.ts:24](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L24)

___

### endpoint

• `Optional` **endpoint**: `string`

local or devnet endpoint for establishing a connection to validators

#### Defined in

[index.ts:22](https://github.com/entropyxyz/sdk/blob/1c426d7/src/index.ts#L22)
