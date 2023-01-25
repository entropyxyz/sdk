/* eslint @typescript-eslint/no-explicit-any: 0 */
import { Substrate } from "./index";
import "mocha";

const { assert } = require("chai");

describe("Substrate Tests", async () => {
  let substrate: Substrate;
  const aliceSeed =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";
  before(async function () {
    substrate = await Substrate.setup(aliceSeed);
  });
  after(function () {
    substrate.api.disconnect();
  });
  it(`checks if registering and registers`, async () => {
    const register: any = await substrate.register("5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN", null);
    assert.equal(register.isRegistering, true);
  });
  it(`gets threshold Info`, async () => {
    const stashKeys = [
      "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
      "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    ];
    const thresholdKeysExpected = [
      {
        endpoint: "127.0.0.1:3001",
        tssAccount: "5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN",
        x25519PublicKey:
          "0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22",
      },
      {
        endpoint: "127.0.0.1:3002",
        tssAccount: "5D2SVCUkK5FgFiBwPTJuTN65J6fACSEoZrL41thZBAycwnQV",
        x25519PublicKey:
          "0xe13087d3e3d5aa1501bd769eff57f55924aaa9b544c9d2b2edf765509988660a",
      },
    ];
    const thresholdKeys = await substrate.getThresholdInfo(stashKeys);
    assert.equal(thresholdKeys.length, 2);
    assert.deepEqual(thresholdKeys, thresholdKeysExpected);
  });
  it(`gets all stash keys from chain and returns the selected ones`, async () => {
    const stashKeys: any = await substrate.getStashKeys();
    assert.equal(stashKeys.length, 2);

    const mockReturnedKeys = [
      "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
      "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    ];

    const returnedKeys: any = substrate.selectStashKeys(stashKeys);
    assert.deepEqual(returnedKeys, mockReturnedKeys);
  });
});
