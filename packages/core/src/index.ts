import { Substrate } from "../../substrate/src";
import { Address } from "../../substrate/src/types";
import { ThresholdServer } from "../../threshold-server/src";
import { Crypto } from "../../crypto/src";
import { keyShare } from "./types";
import { AnyJson } from "@polkadot/types-codec/types";
import { utils } from "ethers";
import { SignatureLike } from "@ethersproject/bytes";

/**
 * Encapsulates all subclasses and exposes functions to make interacting with entropy simple
 */
export default class Entropy {
  crypto: Crypto;
  substrate: Substrate;
  thresholdServer: ThresholdServer;

  /**
   *
   * @param crypto The Crypto class from the crypto package
   * @param substrate The Substrate class from the substrate package
   * @param thresholdServer The thresholdServer class from the threshold server package
   */
  constructor(
    crypto: Crypto,
    substrate: Substrate,
    thresholdServer: ThresholdServer
  ) {
    this.crypto = crypto;
    this.substrate = substrate;
    this.thresholdServer = thresholdServer;
  }

  /**
   * launches all sub classes encapsulated by this class
   * @param seed private key of user interacting with entropy
   * @param endpoint an endpoint for the entropy blockchain (will default to localhost:9944)
   * @returns An Entropy class instance
   */
  static async setup(seed: string, endpoint?: string): Promise<Entropy> {
    const crypto = new Crypto();
    const substrate = await Substrate.setup(seed, endpoint);
    const thresholdServer = new ThresholdServer();

    return new Entropy(crypto, substrate, thresholdServer);
  }

  /**
   * Registers a user in the entropy blockchain
   * @param keyShares Entropy threshold keys to be distributed (including your own to be stored)?
   * @param serverStashKeys The stash keys of the validators to talk to (to be deprecated)
   * @returns A JSON return from the chain which contains a boolean of if the registration was successfully
   */
  async register(
    keyShares: keyShare[],
    serverStashKeys: Address[],
    urls: Array<string>
  ): Promise<AnyJson> {
    //TODO JA better return type
    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo = await this.substrate.getThresholdInfo(
      serverStashKeys
    );

    const encryptedMessages: Array<string> = [];
    for (let i = 0; i < serverStashKeys.length; i++) {
      const serverDHKey = this.crypto.parseServerDHKey(
        thresholdAccountsInfo[i]
      );
      const encryptedMessage = this.crypto.encryptAndSign(
        this.substrate.signer.pair.secretKey,
        keyShares[i],
        serverDHKey
      );
      encryptedMessages.push(encryptedMessage);
    }

    const registerTx = this.substrate.api.tx.relayer.register();
    await this.substrate.sendAndWaitFor(
      registerTx,
      this.substrate.api,
      this.substrate.signer.wallet,
      {
        section: "relayer",
        name: "SignalRegister",
      }
    );

    // TODO get urls from event record (not implemented in devnet)
    // record.event.data[1].toString()}

    await this.substrate.api.query.relayer.registering(
      this.substrate.signer.wallet.address
    );
    // TODO: JA handle result, log info? do nothing? assert it is true?
    await this.thresholdServer.sendKeys(encryptedMessages, urls);

    const isRegistered = await this.substrate.api.query.relayer.registered(
      this.substrate.signer.wallet.address
    );
    return isRegistered.toHuman();
  }

  /**
   * Sign a tx (for ethereum currently) using the entropy blockchain. This will take an unsigned tx and return
   * a signature, it is up to the user to handle from there
   * @param tx the transaction to be signed
   * @param retries To be deprecated when alice signs with the validators, but polling for sig retries
   * @returns A signature to then be included in a transaction
   */
  async sign(
    tx: utils.UnsignedTransaction,
    retries: number
  ): Promise<SignatureLike> {
    const sigData = await utils.serializeTransaction(tx);
    const sigHash = utils.keccak256(sigData);

    const prepTx = await this.substrate.api.tx.relayer.prepTransaction({
      sigHash,
    });
    const record = await this.substrate.sendAndWaitFor(
      prepTx,
      this.substrate.api,
      this.substrate.signer.wallet,
      {
        section: "relayer",
        name: "SignatureRequested",
      }
    );
    const urls = record.event.data.toHuman()[0].ipAddresses;
    // TODO get urls from event record (not implemented in devnet)

    const signature: SignatureLike = await this.thresholdServer.pollNodeForSignature(
      sigHash.slice(2),
      urls[0],
      retries
    );

    return signature;
  }
}
