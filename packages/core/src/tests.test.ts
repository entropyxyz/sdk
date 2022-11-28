import should from "should";
import "mocha";
import Entropy from ".";
import { readKey } from "./utils";
const { assert } = require("chai");
import { BigNumber, ethers } from "ethers";

describe("Core Tests", async () => {
  let entropy: Entropy;
  const aliceSeed =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";
  const urls = ["http://127.0.0.1:3001"];
  before(async function () {
    entropy = await Entropy.setup(urls, aliceSeed);
  });
  after(function () {
    entropy.substrate.api.disconnect();
  });
  it(`registers then signs`, async () => {
    const root = process.cwd();
    const thresholdKey = readKey(`${root.split("packages")[0]}0`);
    const serverStashKeys = [
      "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    ];
    // either works or not working from clean state and keys already there, good error, working error
    try {
      await entropy.register([thresholdKey], serverStashKeys);
    } catch (e: any) {
      assert.equal(e.response.data, "Kv error: Recv Error: channel closed");
    }

    const tx: ethers.utils.UnsignedTransaction = {
      to: "0x772b9a9e8aa1c9db861c6611a82d251db4fac990",
      value: BigNumber.from("1"),
      chainId: 1,
      nonce: 1,
      data: ethers.utils.hexlify(
        ethers.utils.toUtf8Bytes("Created On Entropy")
      ),
    };

    // good error, only running one node so sig will not happen
    try {
      await entropy.sign(tx, 0);
    } catch (e: any) {
      assert.equal(
        e.message,
        "Cannot read properties of undefined (reading 'data')"
      );
    }
  });
});
