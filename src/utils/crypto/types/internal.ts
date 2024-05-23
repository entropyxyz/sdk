// Polkadot Types

// Address Types
// Copyright 2017-2024 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

// FIXME we really want this to map with what is in the allowedSS58 array... i.e. the
// values there. As of now, we just map to number.
export type Prefix = number

// JSON Types
// Copyright 2017-2024 @polkadot/util-crypto authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type EncryptedJsonVersion = '0' | '1' | '2' | '3'

export type EncryptedJsonEncoding = 'none' | 'scrypt' | 'xsalsa20-poly1305'

export interface EncryptedJsonDescriptor {
  /** Descriptor for the content */
  content: string[]
  /** The encoding (in current/latest versions this is always an array) */
  type: EncryptedJsonEncoding | EncryptedJsonEncoding[]
  /** The version of encoding applied */
  version: EncryptedJsonVersion
}

export interface EncryptedJson {
  /** The encoded string */
  encoded: string
  /** The encoding used */
  encoding: EncryptedJsonDescriptor
}

// Crypto Util Types

export interface Keypair {
  /** The publicKey for this pair */
  publicKey: Uint8Array
  /** The secretKey for this pair */
  secretKey: Uint8Array
}

export interface Seedpair {
  /** The publicKey for this pair */
  publicKey: Uint8Array
  /** The seed used to construct the pair */
  seed: Uint8Array
}

/** The supported types of pairs */
export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum'

export interface VerifyResult {
  /** The detected crypto interface, or 'none' if not detected */
  crypto: 'none' | KeypairType
  /** The validity for this result, false if invalid */
  isValid: boolean
  /** Flag to indicate if the passed data was wrapped in <Bytes>...</Bytes> */
  isWrapped: boolean
  /** The extracted publicKey */
  publicKey: Uint8Array
}
