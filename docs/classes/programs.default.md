[@entropyxyz/entropy-js](../README.md) / [Exports](../modules.md) / [programs](../modules/programs.md) / default

# Class: default

[programs](../modules/programs.md).default

**`Remarks`**

The ProgramManager class provides an interface to interact with Entropy Programs.

## Hierarchy

- [`default`](extrinsic.default.md)

  ↳ **`default`**

## Table of contents

### Constructors

- [constructor](programs.default.md#constructor)

### Properties

- [signer](programs.default.md#signer)
- [substrate](programs.default.md#substrate)

### Methods

- [checkAuthorization](programs.default.md#checkauthorization)
- [get](programs.default.md#get)
- [handleFreeTx](programs.default.md#handlefreetx)
- [sendAndWaitFor](programs.default.md#sendandwaitfor)
- [set](programs.default.md#set)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](programs.default.md)

Creates an instance of ProgramManager.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `signer` | [`Signer`](../interfaces/types.Signer.md) |
| › `substrate` | `ApiPromise` |

#### Returns

[`default`](programs.default.md)

**`Remarks`**

The constructor initializes the Substrate api and the signer.

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[programs/index.ts:23](https://github.com/entropyxyz/entropy-js/blob/7732646/src/programs/index.ts#L23)

## Properties

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Inherited from

[default](extrinsic.default.md).[signer](extrinsic.default.md#signer)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/entropy-js/blob/7732646/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Inherited from

[default](extrinsic.default.md).[substrate](extrinsic.default.md#substrate)

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/entropy-js/blob/7732646/src/extrinsic/index.ts#L20)

## Methods

### checkAuthorization

▸ **checkAuthorization**(`programModAccount`, `sigReqAccount`): `Promise`\<`boolean`\>

Checks if a given program modification account is authorized to modify the program associated with a specific signature request account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `programModAccount` | `string` | The account whose authorization is to be verified. |
| `sigReqAccount` | `string` | The account for which the program modification is intended. |

#### Returns

`Promise`\<`boolean`\>

- A promise that resolves if the `programModAccount` is authorized to modify the program for `sigReqAccount`

**`Remarks`**

This method queries Substrate  to determine if the `programModAccount` is allowed to modify the program associated with the `sigReqAccount`.
The method utilizes the `allowedToModifyProgram` quert, which returns an optional value. If the value is present (`isSome`), it indicates authorization.
(I'm not sure about this as the blob that's returned is extremely long )
The method unwraps the optional value

**`Example`**

```typescript
const isAuthorized = await checkAuthorization('5FHneW46...HgYb3fW', '5DAAnrj7...P5JT7zP')
console.log(isAuthorized) // Outputs: true or false
```

#### Defined in

[programs/index.ts:117](https://github.com/entropyxyz/entropy-js/blob/7732646/src/programs/index.ts#L117)

___

### get

▸ **get**(`sigReqAccount?`): `Promise`\<`ArrayBuffer`\>

Retrieves the program associated with a given sigReqAccount (account)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigReqAccount` | `string` | The account key, defaulting to the signer's wallet address if not provided. |

#### Returns

`Promise`\<`ArrayBuffer`\>

- The program as an ArrayBuffer.

**`Throws`**

If no program is defined for the given account.

**`Remarks`**

This method communicates with Substrate to fetch bytecode associated with an account.
The response is then procesed and converted to an ArrayBuffer before being returned

#### Defined in

[programs/index.ts:46](https://github.com/entropyxyz/entropy-js/blob/7732646/src/programs/index.ts#L46)

___

### handleFreeTx

▸ **handleFreeTx**(`call`): `Promise`\<`SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\>\>

Prepares a free transaction, performs a dry run, and ensures its viability.

In this system:
- **Electricity** represents an energy unit allowing certain transactions to bypass traditional fees.
- An account's **Zaps** represent the available electricity it has. Consuming zaps results in transaction execution without fees.
- **Batteries** are rechargeable units in an account that generate zaps over time.

This method leverages the `callUsingElectricity` from the `freeTx` module to create a transaction that utilizes zaps.
A dry run is then performed to ensure its success when broadcasted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | The extrinsic intended for execution. |

#### Returns

`Promise`\<`SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\>\>

A promise resolving to a transaction prepared to use electricity.

**`Throws`**

If the dry run fails or there's insufficient electricity (zaps).

#### Inherited from

[default](extrinsic.default.md).[handleFreeTx](extrinsic.default.md#handlefreetx)

#### Defined in

[extrinsic/index.ts:99](https://github.com/entropyxyz/entropy-js/blob/7732646/src/extrinsic/index.ts#L99)

___

### sendAndWaitFor

▸ **sendAndWaitFor**(`call`, `freeTx?`, `filter`): `Promise`\<`EventRecord`\>

Sends an extrinsic and waits for a specific event or rejects with an error.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | `undefined` | The extrinsic call to send. |
| `freeTx` | `boolean` | `true` | Optional. Flag indicating if the transaction should be free (default: true). |
| `filter` | [`EventFilter`](../interfaces/types.EventFilter.md) | `undefined` | An event filter to wait for. |

#### Returns

`Promise`\<`EventRecord`\>

A promise that resolves with the filtered event record.

**`Throws`**

Will reject the promise if a dispatch error occurs or the filtered event is not found.

#### Inherited from

[default](extrinsic.default.md).[sendAndWaitFor](extrinsic.default.md#sendandwaitfor)

#### Defined in

[extrinsic/index.ts:45](https://github.com/entropyxyz/entropy-js/blob/7732646/src/extrinsic/index.ts#L45)

___

### set

▸ **set**(`program`, `sigReqAccount?`, `programModAccount?`): `Promise`\<`void`\>

Sets or updates the program of a specified account on Substrate
This method allows the current signer or an authorized account to update the program associated with the signer's account or another specified account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `program` | `ArrayBuffer` | The program to be set or updated, as an ArrayBuffer. |
| `sigReqAccount?` | `string` | The account for which the program will be set or updated. Defaults to the signer's account. |
| `programModAccount?` | `string` | Optional. An authorized account to modify the program, if different from the signer's account. |

#### Returns

`Promise`\<`void`\>

A promise that resolves when the transaction has been included in the block.

**`Throws`**

Throws an error if the account is unauthorized or if there's a problem setting the program.

**`Remarks`**

This method handles the conversion of a program from an ArrayBuffer to a hex string
It checks for authorization if the programModAccount is provided, ensuring that only authorized accounts can update the bytecode.
The transaction is created and sent to Substrate. This method then awaits the confirmation event 'ProgramUpdated' to ensure that the update was successful.

#### Defined in

[programs/index.ts:74](https://github.com/entropyxyz/entropy-js/blob/7732646/src/programs/index.ts#L74)
