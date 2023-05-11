/**
 * A class to encapsulate all the cryptography needed for using entropy
 * relies heavily on WASM
 */
export class Crypto {
  /**
   * @alpha
   *
   * @remarks
   * Converts server public encryption key from hex to Uint8Array.
   * TODO: JA give proper type to serverDHInfo
   *
   * @param {*} serverDHInfo - Information on server returned by entropy chain
   * @return {*}  {Promise<Uint8Array>} - converted x25519PublicKey
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
   * @alpha
   *
   * @remarks
   * Encrypts and signs a message to send to a validator
   *
   * @param {Uint8Array} secretKey - User's secret key
   * @param {Uint8Array} message - The message to be encrypted and signed
   * @param {Uint8Array} serverDHKey - Public encryption key of validator to send to
   * @return {*}  {Promise<string>} Either an error message or a JSON serialized signed message
   * @memberof Crypto
   */
  async encryptAndSign(
    secretKey: Uint8Array,
    message: Uint8Array,
    serverDHKey: Uint8Array
  ): Promise<string> {
    if (typeof window === 'undefined') {
      const { encrypt_and_sign } = await import(
        '@entropyxyz/x25519-chacha20poly1305-nodejs'
      )
      return encrypt_and_sign(secretKey, message, serverDHKey)
    } else {
      const { encrypt_and_sign } = await import(
        '@entropyxyz/x25519-chacha20poly1305-web'
      )
      return encrypt_and_sign(secretKey, message, serverDHKey)
    }
  }
}
