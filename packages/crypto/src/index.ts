import { from_hex, encrypt_and_sign } from "x25519";

export class Crypto {
  parseServerDHKey(serverDHInfo: any): Uint8Array {
    return from_hex(serverDHInfo[1]);
  }

  encryptAndSign(
    secretKey: Uint8Array,
    thresholdKey: Uint8Array,
    serverDHKey: Uint8Array
  ): String {
    return encrypt_and_sign(secretKey, thresholdKey, serverDHKey);
  }
}
