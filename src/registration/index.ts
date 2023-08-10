import { ApiPromise } from '@polkadot/api'
import { AnyJson } from '@polkadot/types-codec/types'
import { KeyShare, StashKeys, ThresholdInfo } from '../types'
import { isLoaded, loadCryptoLib } from '../utils/crypto'
import { isValidSubstrateAddress, sendHttpPost } from '../utils'
import { Extrinsic } from '../extrinsic'
import { Signer } from '../types'
// import { ThresholdServer } from '../../old/src/threshold-server'

export interface RegistrationParams {
  keyShares: KeyShare[]
  programModAccount: string
  freeTx?: boolean
  initialProgram?: string
}

export default class RegistrationManager extends Extrinsic {
  substrate: ApiPromise
  signer: Signer
  cryptoLibLoaded: Promise<void>
  cryptoLib: any

  constructor ({ substrate, signer }: {substrate: ApiPromise, signer: Signer}) {
    super({ signer, substrate })
    this.cryptoLibLoaded = this.loadCrypto();
  }

  async loadCrypto() {
    this.cryptoLib = await loadCryptoLib();
  }

  async parseServerDHKey(serverDHInfo: any): Promise<Uint8Array> {
    await this.cryptoLibLoaded;
    const { from_hex } = this.cryptoLib;
    return from_hex(serverDHInfo.x25519PublicKey);
  }

  // private thresholdServer: ThresholdServer = new ThresholdServer(); // temporarily importing from /old

  async register({ keyShares, programModAccount, freeTx = true, initialProgram }: RegistrationParams) {
    await this.cryptoLibLoaded;  // Ensure the library is loaded

    if (!isValidSubstrateAddress(programModAccount)) {
      throw new Error('programModAccount must be a Substrate address');
    }

    const isCurrentlyRegistered = await this.substrate.query.relayer.registered(this.signer.wallet.address);
    if (isCurrentlyRegistered.isSome && isCurrentlyRegistered.unwrap()) {
      throw new Error('already registered');
    }

    const serverKeys = await this.substrate.query.stakingExtension.signingGroups.entries();
    const serverStashKeys = serverKeys.reduce((agg, keyInfo) => {
      // TODO: currently picks first stash key in group (second array item is set to 0)
      // create good algorithm for randomly choosing a threshold server
      agg.push(keyInfo[1].toHuman()[0]);
      return agg;
    }, []);

    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo: any = await this.getThresholdInfo(serverStashKeys)

    const keys: Array<{ encryptedKey: string; url: string; }> = await Promise.all(thresholdAccountsInfo.map(async (thresholdAccountInfo, index) => {
      const serverDHKey = await this.cryptoLib.from_hex(thresholdAccountInfo);
      const encryptedKey = await this.cryptoLib.encrypt_and_sign(this.signer.pair.secretKey, keyShares[index], serverDHKey);

      const url = "url";

      return { encryptedKey, url };
  }));

  await this.sendKeys(keys);

}

  async sendKeys(keysAndUrls: Array<{ encryptedKey: string; url: string; }>): Promise<void> {
      await Promise.all(
          keysAndUrls.map(async ({ url, encryptedKey }, index) =>
              sendHttpPost(`http://${url}/user/new`, encryptedKey)
          )
      );
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   *
   * @param {StashKeys} stashKeys - An array of stash keys to query
   * @returns {*}  {Promise<ThresholdInfo>} threshold server keys associated with the server
   */
  async getThresholdInfo(stashKeys: StashKeys): Promise<ThresholdInfo> {
      const result: ThresholdInfo = [];
      for (let i = 0; i < stashKeys.length; i++) {
          const r = await this.substrate.query.stakingExtension.thresholdServers(stashKeys[i]);
          const convertedResult: any = r.toHuman() ? r.toHuman() : null;
          if (convertedResult) result.push(convertedResult);
      }
      return result;
  }

  async checkRegistrationStatus(): Promise<AnyJson> {
      const isRegistered = await this.substrate.query.relayer.registered(this.signer.wallet.address);
      return isRegistered.toHuman();
  }
}