export interface CryptoLib {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // fuck-polkadot
  polkadotCrypto: any
  verifySignature: (
    message: string,
    signature: string,
    address: string
  ) => Promise<boolean>

  fromHex: (input: string) => Promise<Uint8Array>

  /**
   *
   * @returns Constructor to randomly generate an `X25519Keypair`.
   */

  generate: (X25519Keypair: Uint8Array) => Promise<Uint8Array>

  /**
   * Generates a secret sr25519 signing key and returns it as a Uint8Array.
   * This is really only exposed for testing purposes, as you can also use Polkadot-JS to generate sr25519 keypairs.
   * @param sr25519SigningKey
   * @returns
   */

  generateSigningKey: (sr25519SigningKey: Uint8Array) => Promise<Uint8Array>

  /**
   * Encrypt and sign a message. Takes an sr25519 secret key, a payload to encrypt, and the recipient's publicX25519key,
   * all given as Uint8Arrays. Returns an EncryptedSignedMessage as a JSON serialized string.
   * @param secretKey
   * @param encodedPayload
   * @param publicX25519key
   * @param serverDHKey
   * @returns
   */

  encryptAndSign: (
    secretKey: Uint8Array,
    encodedPayload: Uint8Array,
    publicX25519key: Uint8Array,
    serverDHKey: Uint8Array
  ) => Promise<string>

  /**
   * Decrypts a provided message and verifies its authenticity.
   * Uses the provided secret key for decryption.
   */

  decryptAndVerify: (X25519Keypair: Uint8Array, msg: string) => Promise<string>

  /**
   * Derives the public key from the provided secret key.
   */

  publicKeyFromSecret: (X25519Keypair: Uint8Array) => Promise<Uint8Array>
}

export interface ResolveType {
  (value?: void | PromiseLike<void>): void
}

export interface ResObjectType {
  resolve: ResolveType
}
