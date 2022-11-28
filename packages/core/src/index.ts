import { Substrate } from "../../substrate/src";
import { Address } from "../../substrate/src/types";
import { ThresholdServer } from "../../threshold-server/src";
import { Crypto } from "../../crypto/src";
import { keyShare } from "./types";
import { AnyJson } from "@polkadot/types-codec/types";


export default class Entropy {
  crypto: Crypto;
  substrate: Substrate;
  thresholdServer: ThresholdServer;

  constructor(
    crypto: Crypto,
    substrate: Substrate,
    thresoldServer: ThresholdServer
  ) {
    this.crypto = crypto;
    this.substrate = substrate;
    this.thresholdServer = thresoldServer;
  }

  static async setup(
    urls: Array<String>,
    seed: string,
    endpoint?: string
  ): Promise<Entropy> {
    const crypto = new Crypto();
    const substrate = await Substrate.setup(seed, endpoint);
    const thresholdServer = new ThresholdServer(urls);

    return new Entropy(crypto, substrate, thresholdServer);
  }

  async register(
    keyShares: keyShare[],
    serverStashKeys: Address[]
  ): Promise<AnyJson> {
    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo =
      await this.substrate.getThresholdInfo(serverStashKeys);

    let encryptedMessages: Array<String> = [];
    for (let i = 0; i < serverStashKeys.length; i++) {
	  const serverDHKey = this.crypto.parseServerDHKey(thresholdAccountsInfo[i]);
      const encryptedMessage = this.crypto.encryptAndSign(
        this.substrate.signer.pair.secretKey,
        keyShares[i],
        serverDHKey
      );
      encryptedMessages.push(encryptedMessage);
    }

    const registerTx = this.substrate.api.tx.relayer.register();
    await this.substrate.sendAndWait(
      registerTx,
      this.substrate.api,
      this.substrate.signer.wallet
    );

    const result = await this.substrate.api.query.relayer.registering(
      this.substrate.signer.wallet.address
    );
    // TODO: JA handle result, log info? do nothing? assert it is true?

	await this.thresholdServer.sendKeys(encryptedMessages);

	const isRegistered = await this.substrate.api.query.relayer.registered(this.substrate.signer.wallet.address)
	return isRegistered.toHuman()
  }
}
