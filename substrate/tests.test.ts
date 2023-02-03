import { Substrate } from "./index";
import { spinChain } from "../testing-utils";
import "mocha";

const { assert } = require("chai");

describe("Substrate Tests", async () => {
  let substrate: Substrate;
  const bobSeed =
    "0x398f0c28f98885e046333d4a41c19cee4c37368a9832c6502f6cfd182e2aef89"; // `subkey inspect //Bob` 'secret seed'
  let chainProcess;
  beforeEach(async function () {
    const chainPath = process.cwd() + "/testing-utils/test-binaries/entropy";
    try {
      chainProcess = await spinChain(chainPath);
    } catch (e) {
      throw new Error(e);
    }
    substrate = await Substrate.setup(bobSeed);
  });

  afterEach(async function () {
    substrate.api.disconnect();
    chainProcess.kill();
  });

  it(`checks if registering and registers`, async () => {
    const register: any = await substrate.register(
      "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
      null
    ); // constraint mod account is ALICE_STASH
    assert.equal(register.isRegistering, true);
  });

  it(`gets threshold Info`, async () => {
    const stashKeys = [
      "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY", // validator 1
      "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc", // validator 2
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
