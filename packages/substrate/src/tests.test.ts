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
  it(`connects to a chain`, async () => {});
});
