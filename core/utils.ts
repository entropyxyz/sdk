import { readFileSync } from "node:fs";
import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";

export const readKey = (path: string) => {
  const buffer = readFileSync(path);
  const result = new Uint8Array(buffer.byteLength);
  buffer.copy(result);
  buffer.fill(0);
  return result;
};

export const isValidSubstrateAddress = (address: string) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};
