[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [index](../modules/index.md) / default

# Class: default

[index](../modules/index.md).default

**`Remarks`**

The main interface for users wanting to interact with Entropy.
This class provides methods to register, check registration status,
and sign transactions. Users can await the `ready` promise to ensure
that the class has been initialized before performing operations.

**`Example`**

```typescript
const signer = await getWallet(charlieStashSeed);

const entropyAccount: EntropyAccount = {
  sigRequestKey: signer,
  programModKey: signer,
};

const entropy = new Entropy({ account: entropyAccount });
await entropy.ready;

await entropy.register({ 
  programModAccount: '5Gw3s7q9...', 
  keyVisibility: 'Permissioned', 
  freeTx: false 
});
```

## Table of contents

### Constructors

- [constructor](index.default.md#constructor)

### Properties

- [#allReadOnly](index.default.md##allreadonly)
- [#fail](index.default.md##fail)
- [#programReadOnly](index.default.md##programreadonly)
- [#ready](index.default.md##ready)
- [account](index.default.md#account)
- [isRegistered](index.default.md#isregistered)
- [programModPublicKey](index.default.md#programmodpublickey)
- [programs](index.default.md#programs)
- [ready](index.default.md#ready)
- [registrationManager](index.default.md#registrationmanager)
- [sigRequestPublicKey](index.default.md#sigrequestpublickey)
- [signingManager](index.default.md#signingmanager)
- [substrate](index.default.md#substrate)

### Methods

- [#init](index.default.md##init)
- [#setReadOnlyStates](index.default.md##setreadonlystates)
- [#setVerfiyingKeys](index.default.md##setverfiyingkeys)
- [getVerifyingKey](index.default.md#getverifyingkey)
- [register](index.default.md#register)
- [sign](index.default.md#sign)
- [signTransaction](index.default.md#signtransaction)

## Constructors

### constructor

• **new default**(`opts`): [`default`](index.default.md)

Initializes an instance of the Entropy class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EntropyOpts`](../interfaces/index.EntropyOpts.md) | The configuration options for the Entropy instance. |

#### Returns

[`default`](index.default.md)

#### Defined in

[index.ts:81](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L81)

## Properties

### #allReadOnly

• `Private` **#allReadOnly**: `boolean`

#### Defined in

[index.ts:59](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L59)

___

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

[index.ts:57](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L57)

___

### #programReadOnly

• `Private` **#programReadOnly**: `boolean`

#### Defined in

[index.ts:58](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L58)

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

[index.ts:56](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L56)

___

### account

• `Optional` **account**: [`EntropyAccount`](../interfaces/index.EntropyAccount.md)

#### Defined in

[index.ts:68](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L68)

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

[index.ts:65](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L65)

___

### programModPublicKey

• `Optional` **programModPublicKey**: `string`

#### Defined in

[index.ts:63](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L63)

___

### programs

• **programs**: [`default`](programs.default.md)

#### Defined in

[index.ts:66](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L66)

___

### ready

• **ready**: `Promise`\<`boolean`\>

A promise that resolves once chacha20poly1305 cryptoLib has been loaded

#### Defined in

[index.ts:61](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L61)

___

### registrationManager

• **registrationManager**: [`default`](registration.default.md)

#### Defined in

[index.ts:64](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L64)

___

### sigRequestPublicKey

• `Optional` **sigRequestPublicKey**: `string`

#### Defined in

[index.ts:62](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L62)

___

### signingManager

• **signingManager**: [`default`](signing.default.md)

#### Defined in

[index.ts:67](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L67)

___

### substrate

• **substrate**: `ApiPromise`

#### Defined in

[index.ts:69](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L69)

## Methods

### #init

▸ **#init**(`opts`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `opts` | [`EntropyOpts`](../interfaces/index.EntropyOpts.md) |

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.ts:92](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L92)

___

### #setReadOnlyStates

▸ **#setReadOnlyStates**(): `void`

#### Returns

`void`

#### Defined in

[index.ts:143](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L143)

___

### #setVerfiyingKeys

▸ **#setVerfiyingKeys**(): `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.ts:126](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L126)

___

### getVerifyingKey

▸ **getVerifyingKey**(`address`): `Promise`\<`string`\>

Retrieves the verifying key associated with the given address's registration record.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | [`Address`](../modules/types.md#address) | The address for which the verifying key is needed. |

#### Returns

`Promise`\<`string`\>

- A promise resolving to the verifying key.

#### Defined in

[index.ts:212](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L212)

___

### register

▸ **register**(`params`): `Promise`\<`void`\>

Registers an address with Entropy using the provided parameters.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`RegistrationParams`](../interfaces/registration.RegistrationParams.md) & \{ `account?`: [`EntropyAccount`](../interfaces/index.EntropyAccount.md)  } | The registration parameters. |

#### Returns

`Promise`\<`void`\>

A promise indicating the completion of the registration process.

**`Throws`**

- If the provided address format is incompatible.

**`Throws`**

- If the address is already registered or if there's a problem during registration.

#### Defined in

[index.ts:183](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L183)

___

### sign

▸ **sign**(`params`): `Promise`\<`Uint8Array`\>

Signs a signature request hash. This method involves various steps including validator
selection, transaction request formatting, and submission of these requests to validators
for signing. It returns the signature from the first validator after validation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | [`SigOps`](../interfaces/signing.SigOps.md) | The signature operation parameters. |

#### Returns

`Promise`\<`Uint8Array`\>

- A promise resolving to the signed hash as a Uint8Array.

**`Throws`**

- If there's an error in the signing routine.

#### Defined in

[index.ts:256](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L256)

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
| `params` | [`SigTxOps`](../interfaces/signing.SigTxOps.md) | The parameters for signing the transaction. |

#### Returns

`Promise`\<`unknown`\>

- A promise resolving to the transaction signature.

A promise that returns the transaction signature. Note that the structure
         and format of this signature may differ based on the adapter.

**`Throws`**

- If no adapter is found for the specified transaction type.

**`Throws`**

Will throw an error if the transaction type does not have a corresponding adapter.

#### Defined in

[index.ts:237](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L237)
