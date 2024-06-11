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
- constructor now throws if you pass no object

### Broke

### Dev

### Meta


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
