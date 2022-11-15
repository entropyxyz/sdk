import { Substrate } from "./index";
import should from "should";
import "mocha";

const { assert } = require("chai");

describe("Substrate Tests", async () => {
  let substrate: Substrate;
  before(async function () {
    substrate = await Substrate.getApi();
  });
  after(function () {
    substrate.api.disconnect();
  });
  it(`connects to a chain`, async () => {});
});
