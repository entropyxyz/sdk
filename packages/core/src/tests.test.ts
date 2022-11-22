import should from "should";
import "mocha";
import Entropy from ".";

const { assert } = require("chai");

describe("Core Tests", async () => {
    let entropy: Entropy
    const aliceSeed =
    "0xe5be9a5092b81bca64be81d212e7f2f9eba183bb7a90954f7b76361f6edb5c0a";
    const url = "http://localhost:3001"
    before(async function () {
        entropy = await Entropy.setup(url, aliceSeed)
    });
    after(function () {
        entropy.substrate.api.disconnect()
    });
    it(`done`, async () => { });
});
