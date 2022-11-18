import { from_hex } from "x25519";

export class Crypto {
  parseServerDHKey(serverDHInfo: any): Uint8Array {
    return from_hex(serverDHInfo[1]);
  }
}
