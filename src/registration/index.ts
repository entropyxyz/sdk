import { AnyJson } from '@polkadot/types-codec/types'
import { KeyShare, StashKeys, ThresholdInfo, ValidatorInfo } from '../types'
import { loadCryptoLib, cryptoIsLoaded, crypto } from '../utils/crypto' 
import { isValidSubstrateAddress, sendHttpPost } from '../utils'
import { Extrinsic } from '../extrinsic'
import { Signer, Address } from '../types'
import { ApiPromise } from '@polkadot/api'
import { SignatureRequestManager } from '../signing'

export interface RegistrationParams {
  keyShares: KeyShare
  programModAccount: string
  freeTx?: boolean
  initialProgram?: string
}

export default class RegistrationManager extends Extrinsic {
  substrate: ApiPromise
  signer: Signer

  constructor ({
    substrate,
    signer,
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ signer, substrate })
    loadCryptoLib() 
  }

  async parseServerDHKey (serverDHInfo: any): Promise<Uint8Array> {
    await cryptoIsLoaded
    return crypto.from_hex(serverDHInfo.x25519PublicKey)
  }

  async register ({
    keyShares,
    programModAccount,
    freeTx = true,
    initialProgram,
  }: RegistrationParams) {
    await cryptoIsLoaded // Ensure the library is loaded

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
      validatorsInfo.map(async (validator, index) => {
        const serverDHKey = await crypto.from_hex(validator.x25519PublicKey)
        const encryptedKey = await crypto.encrypt_and_sign(
          this.signer.pair.secretKey,
          keyShares[index],
          serverDHKey
        )

        const url = validator.ipAddress

        return { encryptedKey, url }
      })
    )

    await this.sendKeys(keys)
  }

  async sendKeys (
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
  async getThresholdInfo (stashKeys: StashKeys): Promise<ThresholdInfo> {
    const promises = stashKeys.map((stashKey) =>
      this.fetchThresholdInfo(stashKey)
    )
    const results = await Promise.all(promises)
    return results.filter(Boolean)
  }

  private async fetchThresholdInfo (stashKey: Address): Promise<Address[]> {
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

  async checkRegistrationStatus (): Promise<AnyJson> {
    const isRegistered = await this.substrate.query.relayer.registered(
      this.signer.wallet.address
    )
    return isRegistered.toHuman()
  }
}
