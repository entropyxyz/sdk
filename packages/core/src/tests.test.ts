import should from "should";
import "mocha";
import Entropy from ".";
import { readKey } from "./utils";
const { assert } = require("chai");

describe("Core Tests", async () => {
    let entropy: Entropy
    const aliceSeed =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";
    const urls = ["http://127.0.0.1:3001"]
    before(async function () {
        entropy = await Entropy.setup(urls, aliceSeed)
    });
    after(function () {
        entropy.substrate.api.disconnect()
    });
    it(`register`, async () => { 
        const root = process.cwd();
        const thresholdKey = readKey(`${root.split("packages")[0]}0`);
        const serverStashKeys = ["5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY"]
        // either works or not working from clean state and keys already there, good error, working error
        try {
            await entropy.register([thresholdKey], serverStashKeys)
        } catch (e: any) {
            assert.equal(
                e.response.data,
                "Kv error: Recv Error: channel closed"
              );
        }
    });
});
