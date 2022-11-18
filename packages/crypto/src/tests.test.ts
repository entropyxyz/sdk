import should from "should";
import { Crypto } from "./index";
import "mocha";

const { assert } = require("chai");

describe("Crypto Tests", async () => {
  let crypto = new Crypto();
  before(async function () {});
  after(function () {});
  it(`parses server threshold info`, async () => {
    const mockData = [
      "5H8qc7f4mXFY16NBWSB9qkc6pTks98HdVuoQTs1aova5fRtN",
      "0x0ac029f0b853b23bed652d6d0de69b7cc38d94f93732eefc85b5861e90f73a22",
    ];
    const mockReturn = [
      10, 192, 41, 240, 184, 83, 178, 59, 237, 101, 45, 109, 13, 230, 155, 124,
      195, 141, 148, 249, 55, 50, 238, 252, 133, 181, 134, 30, 144, 247, 58, 34,
    ];

    const result = crypto.parseServerDHKey(mockData);
    assert.deepEqual(result.toString(), mockReturn.toString());
  });
});
