[@entropyxyz/SDK](../README.md) / [Exports](../modules.md) / [programs](../modules/programs.md) / default

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

- [dev](programs.default.md#dev)
- [signer](programs.default.md#signer)
- [substrate](programs.default.md#substrate)

### Methods

- [add](programs.default.md#add)
- [get](programs.default.md#get)
- [handleFreeTx](programs.default.md#handlefreetx)
- [remove](programs.default.md#remove)
- [sendAndWaitFor](programs.default.md#sendandwaitfor)
- [set](programs.default.md#set)

## Constructors

### constructor

• **new default**(`«destructured»`): [`default`](programs.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `programDeployKey?` | [`Signer`](../interfaces/types.Signer.md) |
| › `programModKey` | [`Signer`](../interfaces/types.Signer.md) |
| › `substrate` | `ApiPromise` |

#### Returns

[`default`](programs.default.md)

#### Overrides

[default](extrinsic.default.md).[constructor](extrinsic.default.md#constructor)

#### Defined in

[programs/index.ts:28](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L28)

## Properties

### dev

• **dev**: [`default`](programs_dev.default.md)

Creates an instance of ProgramManager.

**`Param`**

Substrate API object.

**`Param`**

The signer object for the user interfacing with Entropy.

**`Param`**

The signer object for the user interfacing with Entropy.

**`Remarks`**

The constructor initializes the Substrate api and the signer.

#### Defined in

[programs/index.ts:27](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L27)

___

### signer

• **signer**: [`Signer`](../interfaces/types.Signer.md)

#### Inherited from

[default](extrinsic.default.md).[signer](extrinsic.default.md#signer)

#### Defined in

[extrinsic/index.ts:21](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L21)

___

### substrate

• **substrate**: `ApiPromise`

#### Inherited from

[default](extrinsic.default.md).[substrate](extrinsic.default.md#substrate)

#### Defined in

[extrinsic/index.ts:20](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L20)

## Methods

### add

▸ **add**(`newProgram`, `sigReqAccount?`, `programModKey?`): `Promise`\<`void`\>

Adds a new program for a specific account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newProgram` | [`ProgramData`](../interfaces/programs.ProgramData.md) | The new program data to add. |
| `sigReqAccount?` | `string` | The account to add the program to. Defaults to the signer's account. |
| `programModKey?` | `string` | Optional. The authorized account to modify the program, if different from the signer's account. |

#### Returns

`Promise`\<`void`\>

- A promise that resolves when the program is successfully added.

**`Remarks`**

This method fetches the current programs of an account, adds the new program, and updates the state with the new set of programs.
It ensures the operation is performed by an authorized account.

#### Defined in

[programs/index.ts:158](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L158)

___

### get

▸ **get**(`sigReqAccount`): `Promise`\<[`ProgramData`](../interfaces/programs.ProgramData.md)[]\>

Retrieves the program associated with a given sigReqAccount (account)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sigReqAccount` | `string` | The account key, defaulting to the signer's wallet address if not provided. |

#### Returns

`Promise`\<[`ProgramData`](../interfaces/programs.ProgramData.md)[]\>

- The program as an ArrayBuffer.

**`Throws`**

If no program is defined for the given account.

**`Remarks`**

This method communicates with Substrate to fetch bytecode associated with an account.
The response is then processed and converted to an ArrayBuffer before being returned

#### Defined in

[programs/index.ts:52](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L52)

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

[extrinsic/index.ts:99](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L99)

___

### remove

▸ **remove**(`programHashToRemove`, `sigReqAccount?`, `programModKey?`): `Promise`\<`void`\>

Removes a specific program from an account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `programHashToRemove` | `string` | The hash of the program to remove. |
| `sigReqAccount?` | `string` | The account from which the program will be removed. Defaults to the signer's account. |
| `programModKey?` | `string` | Optional. The authorized account to perform the removal, if different from the signer's account. |

#### Returns

`Promise`\<`void`\>

- A Promise resolving when the program is successfully removed.

**`Remarks`**

This method removes a specified program from an account's associated programs. It filters out the specified program and updates the state with the remaining programs.

#### Defined in

[programs/index.ts:133](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L133)

___

### sendAndWaitFor

▸ **sendAndWaitFor**(`call`, `freeTx?`, `filter`): `Promise`\<`EventRecord`\>

Sends an extrinsic and waits for a specific event or rejects with an error.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `call` | `SubmittableExtrinsic`\<``"promise"``, `ISubmittableResult`\> | `undefined` | The extrinsic call to send. |
| `freeTx` | `boolean` | `false` | Optional. Flag indicating if the transaction should be free (default: false). |
| `filter` | [`EventFilter`](../interfaces/types.EventFilter.md) | `undefined` | An event filter to wait for. |

#### Returns

`Promise`\<`EventRecord`\>

A promise that resolves with the filtered event record.

**`Throws`**

Will reject the promise if a dispatch error occurs or the filtered event is not found.

#### Inherited from

[default](extrinsic.default.md).[sendAndWaitFor](extrinsic.default.md#sendandwaitfor)

#### Defined in

[extrinsic/index.ts:45](https://github.com/entropyxyz/SDK/blob/04833ee/src/extrinsic/index.ts#L45)

___

### set

▸ **set**(`newList`, `sigReqAccount?`, `programModKey?`): `Promise`\<`void`\>

Updates the programs of a specified account.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newList` | [`ProgramData`](../interfaces/programs.ProgramData.md)[] | Array of new program data to set. |
| `sigReqAccount?` | `string` | The account for which the programs will be updated. Defaults to the signer's account. |
| `programModKey?` | `string` | Optional. An authorized account to modify the programs, if different from the signer's account. |

#### Returns

`Promise`\<`void`\>

- A Promise that resolves when the programs are successfully updated.

**`Throws`**

- If the account is unauthorized or there's a problem updating the programs.

**`Remarks`**

This method replaces the existing programs of an account with a new set. It checks for authorization and sends a transaction to update the state.

#### Defined in

[programs/index.ts:83](https://github.com/entropyxyz/SDK/blob/04833ee/src/programs/index.ts#L83)
