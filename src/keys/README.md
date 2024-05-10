# Key management

<!--

Explain:

- What keys are.
- How they work.
- How they build off Polkadot.

-->

The user hold onto the seed every class will create their own key via a set derivation path except for the device key.

## Derivation Path

```typescript
import { wasmGlobalsReady, Entropy }
await wasmGlobalsReady

const accounnt = {seed || mnemonic}
const keyring = new Keyring(account)
let persistMe = keyring.accounts.toJson() // ALWAYS store the output of this.
const saveToStorage = (state) => persistMe = state

keyring.accounts.on('account-update', (fullAccount) => { saveToStorage(fullAccount) })

let entropy = New Entropy({keyring, endpoint})
```

```typescript
// New session with same account as before the second time you use entropy:
const loadedFromStorage = persistMe
const newKeyring = new Keyring(loadFromStorage)

keyring.accounts.on('account-update', (fullAccountAsJSON) => { saveToStorage(fullAccountAsJSON) })

entropy = new Entropy({keyring: newKeyring, endpoint})
```

## Account types

### `REGISTERING_ACCOUNT`

<!--TODO: What does the registering account do? Who's gonna use it? Who is _not_ gonna use it?-->

```typescript
{
  seed
  deviceSeed
  deviceDervationPath:
  //this comes from registering a program set
  verfiyingKeys?: string[]
}
```

The `registeredAccount` needs to be thoroughly backed up by the user(/application) if this is lost and no recovery systems have been setup a user will not be able to authorize new devices for signature or change program configurations

### `CONSUMER_ACCOUNT`

<!--TODO: What does the registering account do? Who's gonna use it? Who is _not_ gonna use it?-->

This is the bare minimum for signing new device keys need to be authorized by the registering key by changing the programConfig.

```typescript
{
  seed:
  registeringAdress?:
  verfiyingKeys: string[]
  dervationPath:
}
```

### `PROGRAM_DEV_ACCOUNT`

<!--TODO: What does the registering account do? Who's gonna use it? Who is _not_ gonna use it?-->

A program dev account does not need to be registered. Its main function is to deploy new programs to chain.

```typescript
{
  seed:
}
```

Can have all or any keys be

## Verifying keys

Verifying keys are what is returned when a user registers an entropy account on chain. This verifying key is what a signatures public key will be verified against. It is possible for a single entropy account to have many verifying keys, so it is recommend that after registering an entropy account to store meta information about a particular configuration.

There is no private key for this because the _key_ is publically accessible on the entropy network.

```typescript
interface VerfiyingKey {
  verifyingKeyId: string,
  programInterface: {...any, description: string type: string},
}
```

An entropy account state as a whole:

```typescript
{
  type:EntropyAccountType PROGRAM_DEV_ACCOUNT || REGISTERING_ACCOUNT || CONSUMER_ACCOUNT
  verifyingKeys?: VerfiyingKey[]
  // if this exist do not loose
  seed?:
  // semi ephemeral
  deviceSeed?:
  deviceDervation?:
}
```

A seed is what we use to generate keys and a mnemonic is what a end user sees

generateMnemonic

generateSeed

mnemonicToSeed

seedToMnemonic
to present to end users a phrase

end user facing:

createEntropyAccount({seed, type: EntropyAccountType })

entropyAccountToSigner

```ts
/*this is pseudo code will not run if you try it*/

const storedAccount: EntropyAccountInfo = loadFromStorage()

const account: EntropyAccount =
  /*create a new account*/ createEntropyAccount(storedAccount) // or loads an account from storage
account.on('update', (fullAccountInfo) => persist(fullAccountInfo))

const entropy = new Entropy({ account })
```
