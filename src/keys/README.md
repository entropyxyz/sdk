How "Key mangment should be done in the sdk"

the user hold onto the seed every class will create their own key via a set derivation path except for the device key. the dervation path for the device key should be by
Derivation Path
```ts
//store that private key

import { wasmGlobalsReady, Entropy }

await wasmGlobalsReady

const accounnt = {seed || mnemonic}
const keyring = new Keyring(account)
// you should allways store what comes from this
let persistMe = keyring.accounts.toJson()
const saveToStorage = (state) => persistMe = state
keyring.accounts.on('account-update', (fullAccount) => { saveToStorage(fullAccount) })

let entropy = New Entropy({keyring, endpoint})
// session end

// new session with same account as before
// the second time you use entropy:
const loadedFromStorage = persistMe

const newKeyring = new Keyring(loadFromStorage)

keyring.accounts.on('account-update', (fullAccountAsJSON) => { saveToStorage(fullAccountAsJSON) })


entropy = new Entropy({keyring: newKeyring, endpoint})

```

``

`'REGISTERING_ACCOUNT'`:
this kind of account type looks like this:

```
{
  seed
  deviceSeed
  deviceDervationPath:
  //this comes from registering a program set
  verfiyingKeys?: string[]
}
```

registeredAccount needs to be thoroughly backed up by the user(/application) if this is lost and no recovery systems have been setup a user will not be able to authorize new devices for signature or change program configurations

`'CONSUMER_ACCOUNT'`

this is the bare minimum for signing new device keys need to be authorized by the registering key by changing the programConfig

```
{
  seed:
  registeringAdress?:
  verfiyingKeys: string[]
  dervationPath:
}
```

`'PROGRAM_DEV_ACCOUNT'`

a program dev account does not need to be registered. Its main function is to deploy new programs to chain.

```
{
  seed:
}
```

can have all or any keys be


A note about verifying keys:

verifying keys are what is returned when a user registers an entropy account on chain this verifying key is what a signatures public key will be verified against. It is possible for a single entropy account to have many verifying keys so it is recommend that after registering an entropy account to store meta information about a particular configuration for example:

there is no private key for this because the "priavte key" is on the entropy network

```
interface VerfiyingKey {
  verifyingKeyId: string,
  programInterface: {...any, description: string type: string},
}
```

an entropy account state as a whole:

```
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

const account: EntropyAccount = /*create a new account*/ createEntropyAccount(storedAccount)// or loads an account from storage
account.on('update', (fullAccountInfo) => persist(fullAccountInfo))

const entropy = new Entropy({ account })

```
