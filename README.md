# entropy-js

`entropy-js` is a collection of TS packages that allow you to interact with the Entropy network. This is currently in **alpha** release.

![EN-Backgrounds-2023-7-5_11-35-31](https://github.com/entropyxyz/entropy-js/assets/62079777/070ebeb6-6c70-4087-b901-9f82ee724dbf)

### Installation
yarn:
```js
yarn add @entropyxyz/entropy-js
```

npm:
```js
npm i @entropyxyz/entropy-js --save
```

### Usage

NOTICE 
`endpoint ` defaults to 'ws://127.0.0.1:9944' if no value is provided. 

```js
import Entropy from '@entropyxyz/entropy-js'

// Initialize entropy

const signer = await getWallet(charlieStashSeed)
const entropyAccount = {
  sigRequestKey: signer,
  programModKey: signer
}

const entropy = new Entropy({ account: entropyAccount})
await entropy.ready

```

# Register

▸ **init**(address): `Promise`\<`RegisteredInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | Address |

#### Returns

`Promise`\<`RegisteredInfo`\>

#### Defined in

[index.ts:47](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L47)

___

### register

▸ **register**(`params`): `Promise`\<`undefined`\>

Registers an address to Entropy using the provided parameters.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | [`RegistrationParams`](./docs/interfaces/registration.RegistrationParams.md) |

#### Returns

`Promise`\<`undefined`\>

A promise indicating the completion of the registration process.

**`Throws`**

Throws if the provided address format is not compatible.

**`Throws`**

Throws if the address being registered is already in use.

#### Example(s)
```js
 const address = entropy.account?.wallet.address
 console.log({ address })

// Can do a pre-check to see if the address is registered 

 const isRegistered = await entropy.registrationManager.checkRegistrationStatus(address)
 console.log(isRegistered)

// Register the address

 await entropy.register({
        address,
        keyVisibility: 'Permissioned',
        freeTx: false,
      })

// Check post-registration    

 const postRegistrationStatus = await entropy.isRegistered(address)
 console.log(postRegistrationStatus)

 ```     

#### Defined in

[index.ts:103](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L103)

___

# ProgramMananger

- [checkAuthorization](programs.default.md#checkauthorization)
- [get](programs.default.md#get)
- [handleFreeTx](programs.default.md#handlefreetx)
- [sendAndWaitFor](programs.default.md#sendandwaitfor)
- [set](programs.default.md#set)


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

[programs/index.ts:117](https://github.com/entropyxyz/entropy-js/blob/368842b/src/programs/index.ts#L117)

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

[programs/index.ts:46](https://github.com/entropyxyz/entropy-js/blob/368842b/src/programs/index.ts#L46)

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

[extrinsic/index.ts:99](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L99)

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

[extrinsic/index.ts:45](https://github.com/entropyxyz/entropy-js/blob/368842b/src/extrinsic/index.ts#L45)

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

[programs/index.ts:74](https://github.com/entropyxyz/entropy-js/blob/368842b/src/programs/index.ts#L74)

___

# sign

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
| `params` | [`SigOps`](./docs/interfaces/signing.SigOps.md) | An object `sigRequestHash`, representing the hash of the request awaiting signature. |

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
| `params` | [`SigTxOps`](./docs/interfaces/signing.SigTxOps.md) | An object that encapsulates all the required parameters for signing. |

#### Returns

`Promise`\<`unknown`\>

A promise that returns the transaction signature. Note that the structure
         and format of this signature may differ based on the adapter.

**`Throws`**

Will throw an error if the transaction type does not have a corresponding adapter.

#### Examples(s)

```js
  const signature: Uint8Array = await entropy.sign({
    sigRequestHash: serializedTx,
  })

```

#### Defined in

[index.ts:132](https://github.com/entropyxyz/entropy-js/blob/b4c1b9b/src/index.ts#L132)