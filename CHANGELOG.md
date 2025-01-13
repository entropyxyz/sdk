# Changelog

All notable changes to this project will be documented in this file.

The format extends [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
**At the moment this project DOES NOT adhere to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).**

**Until MAJOR version 1; All MINOR versions are breaking changes and all patch versions are bug fixes and features.**

Version header format: `[version] Name - year-month-day (entropy-core compatibility: version [range])`

## [UNRELEASED]

### Added

### Fixed

### Changed

### Broke

### Dev

### Meta

## [0.4.1] Goumang - 2025-01-09 (entropy-core compatibility: 0.3.0)
### Added
- utility method to return substrate api instance to interact with without needing to instantiate entropy instance (#435)[https://github.com/entropyxyz/sdk/pull/435]
- verifying method for signatures `keccak` and `blake2_256` hashed signatures [#445](https://github.com/entropyxyz/sdk/pull/445)
### Fixed

### Changed

### Broke
- sign and sign with adapters no longer returns just the signature. It now returns a object `SignatureData` that contains the signature and information pronating to it see the `SignatureData` interface in (./src/signing/index.ts)(./src/signing/index.ts) [#445](https://github.com/entropyxyz/sdk/pull/445)
- `entropy.sign` and `entropy.signWithAdaptersInOrder` function argument interface key renamed `sigRequestHash` -> `hexMessage` [#445](https://github.com/entropyxyz/sdk/pull/445)
### Dev

- patch upgrade of `rollup` [#444](https://github.com/entropyxyz/sdk/pull/444)

### Meta

## [0.4.0] Fa - 2024-11-05 (entropy-core compatibility: 0.3.0)

### Fixed
- format error when getting a program not on chain [#429](https://github.com/entropyxyz/sdk/pull/429)

### Broke
- registration parmas now matches core language `programDeployer` -> `programModAddress` when [#429](https://github.com/entropyxyz/sdk/pull/429)

## [0.3.0] Echo - 2024-10-23 (entropy-core compatibility: 0.3.0)

### Added
  - `configurationSchema` & `auxiliaryDataSchema` to `ProgramInterface`
  - added new testing function `jumpStartNetwork(entropy: Entropy) => Promise<undefined>` This function must be called now with a funded key to kick off the network. **It will not work for networks with less then 4 validators**
  - added new docker script for four nodes
  - `spinNetworkDown` now has an access to the env var `ENTROPY_DONT_KILL` which will preserve the network
    the initial though for this was to look at network logs for debugging

### Fixed

### Breaking Changes
  - util function rename: `hex2buf` -> `hexStringToBuffer`
  - massive changes to `entropy.programs.dev`: (Look at documentation for more details)
    - `getProgramInfo` -> `get` and bytecode is returned as a buffer. not a Uint8buffer to match what was deployed
    - you now get owned programs for an address using `getByDeployer`.
    - interface name change: `ProgramInfo` -> `ProgramInterface`

### Removed
  - `dev/docker-scripts/two-nodes.yaml`

### Dev
  - update core version: v0.3.0
  - `CharlieStash` should no longer be used in dev environments use `eve` see sdk test
  - warning logs from polkadot js should be quieter

## [0.2.3] Cybele - 2024-07-24 (entropy-core compatibility: 0.2.0)

### Dev
 - no longer building node modules into dist [402](https://github.com/entropyxyz/sdk/pull/402)


## [0.2.2] Bathala - 2024-07-11 (entropy-core compatibility: 0.2.0)

### Added
- now exports utils [395](https://github.com/entropyxyz/sdk/pull/395)
- now exports testing environments from /dev [393](https://github.com/entropyxyz/sdk/pull/393/files)
### Fixed
- hot fix for issue #380: try in reverse order for testnet environment
- `entropy.signingManager.getTimeStamp` -> `entropy.signingManager.getBlockNumber` signature request no longer takes a time stamp and now takes a block number. [396](https://github.com/entropyxyz/sdk/pull/396)

### Changed
- constructor now throws if you pass no object
- sign now takes a verifying key [382](https://github.com/entropyxyz/sdk/pull/382)

## [0.2.1] Amihan - 2024-06-06 (entropy-core compatibility: 0.1.0)

### *** DISCLAIMER ***
**A lot changed in this version this changelog entry may not be completely accurate and is non standard due to team change of hands complications**

### Changed/Added[/Broke]
- `getWallet` was removed in favor of `keyring` pattern
- verifying keys are now the main way to look up programs
- we no longer have permission accounts. only public
- default registration now registers you with a default program. See new adapter for this `deviceKeyProxy`
- `signWithAdapter` has been replaced with `signWithAdaptersInOrder`
- we no longer use jest it is now tape for tests
- `dev/bin` has more scripts for network spin ups!
- any mention of eth has been removed till further until further research has been conducted on the matter
- `getOwnedPrograms` has been added to dev
- core version has been updated to 0.1.0
- polkadot should spew less logs now
- loads of tests have been added
- new process is being put in place for the team

# versions under here are pre test-net and are not supported

## [0.1.4] Bacchus - 2024-01-09 (entropy-core compatibility: 0.0.10)

### Changed

- the signTransaction:eth adapter now return the serialized raw transaction string (#292)

### Fixed

- sigRequest may now be hex prefixed and not cause internal issues where choosing validators returns undefined. (#293)

## [0.1.3] Bes - 2024-01-31 (entropy-core compatibility: 0.0.10)

### Breaking Changes:

- `@entropyxyz/entropy-js` is now `@entropyxyz/sdk`

### Added

- Update programs and signing (#283):
- `entropy.programs.dev` is the new interface to deploying programs
- signing now supports auxilaryData

### Changed

- register now takes a list of program pointers instead of a single program bytecode
- programs class now only deals with registered account program pointers
- deploying a program now happens under dev programs sub class
- sign takes a hash function name defined by core protocol for hashing the signature

## [0.1.2] Amun - 2023-12-12 (entropy-core compatibility: 0.0.9)

### Added

- now supports separate keys for registering and program management (#252)
- add entropy class type (#259)

### Changed

- register now returns the registration record from storage (#264)

### Fixed

- entropy now validates proofs from tss nodes before returning signature. Will error if no valid proof is given (#230)
- Eth adapter (#260)
- getWallet no longer returns a nested signer (#263)
