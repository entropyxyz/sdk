import { ApiPromise } from '@polkadot/api'
import { AnyJson } from '@polkadot/types-codec/types'
import { KeyShare, StashKeys, ThresholdInfo } from '../types'
import { isLoaded, loadCryptoLib } from '../utils/crypto'
import { isValidSubstrateAddress, sendHttpPost } from '../utils'
import { Extrinsic } from '../extrinsic'
import { Signer, Address } from '../types'
import { SignatureRequestManager } from '../signing'
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

  constructor({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
    this.cryptoLibLoaded = this.loadCrypto()
  }

  async loadCrypto() {
    this.cryptoLib = await loadCryptoLib()
  }

  async parseServerDHKey(serverDHInfo: any): Promise<Uint8Array> {
    await this.cryptoLibLoaded
    const { from_hex } = this.cryptoLib
    return from_hex(serverDHInfo.x25519PublicKey)
  }

  // private thresholdServer: ThresholdServer = new ThresholdServer(); // temporarily importing from /old

  async register({
    keyShares,
    programModAccount,
    freeTx = true,
    initialProgram,
  }: RegistrationParams) {
    await this.cryptoLibLoaded // Ensure the library is loaded

    if (!isValidSubstrateAddress(programModAccount)) {
      throw new Error('programModAccount must be a Substrate address')
    }

    const isCurrentlyRegistered = await this.substrate.query.relayer.registered(
      this.signer.wallet.address
    )
    if (isCurrentlyRegistered.isSome && isCurrentlyRegistered.unwrap()) {
      throw new Error('already registered')
    }

    const keys: Array<{
      encryptedKey: string
      url: string
    }> = await Promise.all(
      validatorsInfo.map(async (validator, index) => { // fix this 
        const serverDHKey = await this.cryptoLib.from_hex(
          validator.x25519PublicKey
        )
        const encryptedKey = await this.cryptoLib.encrypt_and_sign(
          this.signer.pair.secretKey,
          keyShares[index],
          serverDHKey
        )

        const url = validator.ipAddress // extracting the URL from the validator info is this is how we should do it?

        return { encryptedKey, url }
      })
    )

    await this.sendKeys(keys)
  }

  async sendKeys(
    keysAndUrls: Array<{ encryptedKey: string, url: string }>
  ): Promise<void> {
    await Promise.all(
      keysAndUrls.map(async ({ url, encryptedKey }, index) =>
        sendHttpPost(`http://${url}/user/new`, encryptedKey)
      )
    )
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
    const promises = stashKeys.map((stashKey) =>
      this.fetchThresholdInfo(stashKey)
    )
    const results = await Promise.all(promises)
    return results.filter(Boolean)
  }

  private async fetchThresholdInfo(stashKey: Address): Promise<Address[]> {
    const r = await this.substrate.query.stakingExtension.thresholdServers(
      stashKey
    )
    const convertedResult = r.toHuman()

    // If it's undefined, return an empty array.
    if (convertedResult === undefined) {
      return []
    }

    // If it's an array and the first element is of type Address, return it.
    if (
      Array.isArray(convertedResult) &&
      (typeof convertedResult[0] === 'string' ||
        convertedResult[0] instanceof Uint8Array)
    ) {
      return convertedResult as Address[]
    }

    // Otherwise, return an empty array.
    return []
  }

  async checkRegistrationStatus(): Promise<AnyJson> {
    const isRegistered = await this.substrate.query.relayer.registered(
      this.signer.wallet.address
    )
    return isRegistered.toHuman()
  }
}
