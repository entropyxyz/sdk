[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

**`Remarks`**

The main interface for users wanting to interact with Entropy.
This class provides methods to register, check registration status,
and sign transactions.
Users can await the `ready` promise to ensure that the class has been initialized
before performing operations.

**`Example`**

```typescript
const entropy = new Entropy({ seed: 'SEED', endpoint: 'wss://localhost:8080' })
await entropy.ready
await entropy.register({ address, keyVisibility: 'Permissioned', freeTx: false })
```

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [#fail](index.default.md##fail)
- [#ready](index.default.md##ready)
- [isRegistered](index.default.md#isregistered)
- [keys](index.default.md#keys)
- [programs](index.default.md#programs)
- [ready](index.default.md#ready)
- [registrationManager](index.default.md#registrationmanager)
- [signingManager](index.default.md#signingmanager)
- [substrate](index.default.md#substrate)

### Methods

- [init](index.default.md#init)
- [register](index.default.md#register)
- [sign](index.default.md#sign)
- [signTransaction](index.default.md#signtransaction)

## Constructors

### constructor

• **new default**(`opts`): [`default`](index.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EntropyOpts`](../interfaces/index.EntropyOpts.md) |

#### Returns

[`default`](index.default.md)

#### Defined in

[index.ts:80](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L80)

## Properties

### #fail

• `Private` `Optional` **#fail**: (`reason?`: `unknown`) => `void`

#### Type declaration

▸ (`reason?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `reason?` | `unknown` |

##### Returns

`void`

#### Defined in

[index.ts:41](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L41)

___

### #ready

• `Private` `Optional` **#ready**: (`value?`: `unknown`) => `void`

#### Type declaration

▸ (`value?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `value?` | `unknown` |

##### Returns

`void`

#### Defined in

[index.ts:40](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L40)

___

### isRegistered

• **isRegistered**: (`address`: [`Address`](../modules/types.md#address)) => `Promise`\<`boolean`\>

#### Type declaration

▸ (`address`): `Promise`\<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](../modules/types.md#address) |

##### Returns

`Promise`\<`boolean`\>

#### Defined in

[index.ts:47](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L47)

___

### keys

• `Optional` **keys**: [`Signer`](../interfaces/types.Signer.md)

#### Defined in

[index.ts:45](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L45)

___

### programs

• **programs**: [`default`](programs.default.md)

#### Defined in

[index.ts:48](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L48)

___

### ready

• **ready**: `Promise`\<`void`\>

A promise that resolves once chacha20poly1305 cryptoLib has been loaded

#### Defined in

[index.ts:44](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L44)

___

### registrationManager

• **registrationManager**: [`default`](registration.default.md)

#### Defined in

[index.ts:46](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L46)

___

### signingManager

• **signingManager**: [`default`](signing.default.md)

#### Defined in

[index.ts:49](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L49)

___

### substrate

• **substrate**: `ApiPromise`

#### Defined in

[index.ts:51](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L51)

## Methods

### init

▸ **init**(`opts`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EntropyOpts`](../interfaces/index.EntropyOpts.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.ts:53](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L53)

___

### register

▸ **register**(`params`): `Promise`\<`undefined`\>

Registers an address to Entropy using the provided parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`RegistrationParams`](../interfaces/registration.RegistrationParams.md) |

#### Returns

`Promise`\<`undefined`\>

A promise indicating the completion of the registration process.

**`Throws`**

Throws if the provided address format is not compatible.

**`Throws`**

Throws if the address being registered is already in use.

#### Defined in

[index.ts:103](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L103)

___

### sign

▸ **sign**(`params`): `Promise`\<`Uint8Array`\>

The `sign` method is tasked with signing a `sigRequestHash`, which is essentially a hash of the 
request that needs signing. It does so by obtaining validator information based on the hash, 
formatting transaction requests for these validators, and then submitting these requests for the 
validators to sign.

The process in detail:
1. The method removes any hex prefix from the request hash.
2. Determines a set of validators corresponding to the stripped request hash. These validators 
   are tasked with validating and signing the transaction.
3. For each of these validators, the method constructs a transaction request. This request encompasses:
   - The stripped transaction request hash.
   - Information regarding all the chosen validators.
   - A timestamp.
4. Transaction requests are individually encrypted and signed for each validator using their respective public keys.
5. These encrypted and signed transaction requests are dispatched to the individual validators.
6. The method then awaits the validators' signatures on the requests.
7. Once received, the signature from the first validator is extracted and returned.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SigOps`](../interfaces/signing.SigOps.md) | An object `sigRequestHash`, representing the hash of the request awaiting signature. |

#### Returns

`Promise`\<`Uint8Array`\>

A promise which, when resolved, produces a Uint8Array with the signature of the first validator.

**`Throws`**

Throws an error if there's an error at any stage in the signing routine.

#### Defined in

[index.ts:163](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L163)

___

### signTransaction

▸ **signTransaction**(`params`): `Promise`\<`unknown`\>

Signs a given transaction based on the provided parameters.

The `signTransaction` method invokes the appropriate adapter (chain based configuration) 
based on the type specified in the `params`. This modular approach ensures that various 
transaction types can be supported. The method performs a series of operations, starting 
with the `preSign` function of the selected adapter, followed by the actual signing of the 
transaction request hash, and if necessary, the `postSign` function of the adapter.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SigTxOps`](../interfaces/signing.SigTxOps.md) | An object that encapsulates all the required parameters for signing. |

#### Returns

`Promise`\<`unknown`\>

A promise that returns the transaction signature. Note that the structure 
         and format of this signature may differ based on the adapter.

**`Throws`**

Will throw an error if the transaction type does not have a corresponding adapter.

#### Defined in

[index.ts:132](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L132)
