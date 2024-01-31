# SDK

` @entropyxyz/SDK` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

![EN-Backgrounds-2023-7-5_11-35-31](https://github.com/entropyxyz/entropy-js/assets/62079777/070ebeb6-6c70-4087-b901-9f82ee724dbf)

### Installation
yarn:
```js
yarn add @entropyxyz/SDK
```

npm:
```js
npm i @entropyxyz/SDK --save
```

### Usage

NOTICE 
`endpoint ` defaults to 'ws://127.0.0.1:9944' if no value is provided. 

```js
import Entropy from '@entropyxyz/SDK'

// Initialize entropy

const signer = await getWallet(charlieStashSeed)
const entropyAccount = {
  sigRequestKey: signer,
  programModKey: signer
}

const entropy = new Entropy({ account: entropyAccount})
await entropy.ready

```

### Methods

- [getVerifyingKey](README.md#getverifyingkey)
- [register](README.md#register)
- [sign](README.md#sign)
- [signTransaction](README.md#signtransaction)

## Constructors

### constructor

• **new default**(`opts`): [`default`](README.md)

Initializes an instance of the Entropy class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `opts` | [`EntropyOpts`](docs/interfaces/index.EntropyOpts.md) | The configuration options for the Entropy instance. |

#### Returns

[`default`](README.md)

#### Defined in

[index.ts:81](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L81)

## Properties

### account

• `Optional` **account**: [`EntropyAccount`](docs/interfaces/index.EntropyAccount.md)

#### Defined in

[index.ts:68](https://github.com/entropyxyz/SDK/blob/04833ee/src/index.ts#L68)

___

### isRegistered

• **isRegistered**: (`address`: [`Address`](docs/modules/types.md#address)) => `Promise`\<`boolean`\>

#### Type declaration

▸ (`address`): `Promise`\<`boolean`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `address` | [`Address`](docs/modules/types.md#address) |

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
| `opts` | [`EntropyOpts`](docs/interfaces/index.EntropyOpts.md) |

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
| `address` | [`Address`](docs/modules/types.md#address) | The address for which the verifying key is needed. |

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
| `params` | [`RegistrationParams`](docs/interfaces/registration.RegistrationParams.md) & \{ `account?`: [`EntropyAccount`](docs/interfaces/index.EntropyAccount.md)  } | The registration parameters. |

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
| `params` | [`SigOps`](docs/interfaces/signing.SigOps.md) | The signature operation parameters. |

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
| `params` | [`SigTxOps`](docs/interfaces/signing.SigTxOps.md) | The parameters for signing the transaction. |

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
