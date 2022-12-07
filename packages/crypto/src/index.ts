/* eslint @typescript-eslint/no-explicit-any: 0 */
import { from_hex, encrypt_and_sign } from "x25519";
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
  parseServerDHKey(serverDHInfo: any): Uint8Array {
    return from_hex(serverDHInfo[1]);
  }

  /**
   *
   * @param secretKey user's secret key
   * @param thresholdKey entropy threshold key of user for validator to store
   * @param serverDHKey threshold key of validator to send to
   * @returns String of the encrypted message to send to validator
   */
  encryptAndSign(
    secretKey: Uint8Array,
    thresholdKey: Uint8Array,
    serverDHKey: Uint8Array
  ): string {
    return encrypt_and_sign(secretKey, thresholdKey, serverDHKey);
  }
}
