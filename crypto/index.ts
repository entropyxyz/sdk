/**
 * A class to encapsulate all the cryptography needed for using entropy
 * relies heavily on WASM
 */
export class Crypto {
  // TODO: JA give proper type to serverDHInfo
  /**
   *
   * @param serverDHInfo Information on server returned by entropy chain
   * @returns converted x25519PublicKey
   */
  async parseServerDHKey(serverDHInfo: any): Promise<Uint8Array> {
    if (typeof window === 'undefined') {
      const { from_hex } = await import(
        '@entropyxyz/x25519-chacha20poly1305-nodejs'
      )
      return from_hex(serverDHInfo.x25519PublicKey)
    } else {
      const { from_hex } = await import(
        '@entropyxyz/x25519-chacha20poly1305-web'
      )
      return from_hex(serverDHInfo.x25519PublicKey)
    }
  }

  /**
   *
   * @param secretKey user's secret key
   * @param thresholdKey entropy threshold key of user for validator to store
   * @param serverDHKey threshold key of validator to send to
   * @returns String of the encrypted message to send to validator
   */
  async encryptAndSign(
    secretKey: Uint8Array,
    thresholdKey: Uint8Array,
    serverDHKey: Uint8Array
  ): Promise<string> {
    if (typeof window === 'undefined') {
      const { encrypt_and_sign } = await import(
        '@entropyxyz/x25519-chacha20poly1305-nodejs'
      )
      return encrypt_and_sign(secretKey, thresholdKey, serverDHKey)
    } else {
      const { encrypt_and_sign } = await import(
        '@entropyxyz/x25519-chacha20poly1305-web'
      )
      return encrypt_and_sign(secretKey, thresholdKey, serverDHKey)
    }
  }
}
