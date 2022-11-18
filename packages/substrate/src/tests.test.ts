import { Substrate } from "./index";
import should from "should";
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
    const register: any = await substrate.register();
    assert.equal(register.isRegistering, true);
  });
  it(`gets threshold keys`, async () => {
    const stashKeys = [
      "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
      "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    ];
    const thresholdKeysExpected = [
      "5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN",
      "5D2SVCUkK5FgFiBwPTJuTN65J6fACSEoZrL41thZBAycwnQV",
    ];
    const thresholdKeys = await substrate.getThresholdAccounts(stashKeys);
    assert.equal(thresholdKeys.length, 2);
    assert.deepEqual(thresholdKeys, thresholdKeysExpected);
  });
});
