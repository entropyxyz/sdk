[0.1.2] - Amun - 2023-12-12 (entropy-core compatibility: 0.0.9)
Added
- now supports separate keys for registering and program management (#252)
- add entropy class type (#259)

Changed

- register now returns the registration record from storage (#264)

Fixed
- entropy now validates proofs from tss nodes before returning signature. Will error if no valid proof is given (#230)
- Eth adapter (#260)
- getWallet no longer returns a nested signer (#263)