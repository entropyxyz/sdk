# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

At the moment this project **does not** adhere to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
