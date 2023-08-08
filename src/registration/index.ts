import { keyShare, StashKeys, ThresholdInfo } from './types'
import { isLoaded, loadCryptoLib } from './utils/crypto'
import { isValidSubstrateAddress } from './utils'
import Extrinsic from './extrinsic'
export interface RegistrationParams {
  keyShares: keyShare[]
  programModAccount: string
  freeTx?: boolean
  initialProgram?: string
}

/*
registration function needs acess to substrate api for:
getStashKeys
selectStashKeys
getThresholdInfo
this.net.substrate.tx.relayer.register
sendAndWaitFor
*/


const

export default class RegistrationManager extends Extrinsic {
  constructor ({ substrate, signer, thresholdServer }) {
    super({ signer, substrate })
    this.isCryptoLoaded = isLoaded
    this.crypto = loadCryptoLib()
    this.thresholdServer = thresholdServer
  }

  async register({ keyShares, programModAccount, freeTx = true, initialProgram }: RegistrationParams) {
    if (!isValidSubstrateAddress(programModAccount)) {
      throw new Error(
        'programModAccount must be a Substrate address'
      )
    }
    const isCurrentlyRegistered = await this.substrate.query.relayer.registered(
      this.signer.wallet.address
    )
    if (!!isCurrentlyRegistered.is_registering) throw new Error('already registered')


    const server = await this.substrate.query.stakingExtension.signingGroups.entries()
    const serverStashKeys = serverKeys.reduce((agg, keyInfo) => {
      // TODO: currently picks first stash key in group (second array item is set to 0)
      // create good algorithm for randomly choosing a threshold server
      agg.push(keyInfo[1].toHuman()[0])
    }, [])

    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo: any = await this.getThresholdInfo(serverStashKeys)

    const keys: Array<{ encryptedKeys: string; serversWithPort: string; }> = await Promise.all(thresholdAccountsInfo.map(async (thresholdAccountInfo, index) => {
      const serverDHKey = await this.crypto.from_hex(
        thresholdAccountInfo
      )
      const encryptedKey = await this.crypto.encrypt_and_sign(
        this.signer.pair.secretKey,
        keyShares[index],
        serverDHKey
      )
      return { encryptedKey, url }
    }))

    const registerTx = this.substrate.tx.relayer.register(
      programModAccount,
      initialProgram ? initialProgram : null
    )

    await this.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })
    // @Jesse question: what is the return value of this?
    await this.substrate.query.relayer.registering(
      this.signer.wallet.address
    )
    // TODO: JA handle result, log info? do nothing? assert it is true?
    await this.thresholdServer.sendKeys(keys)

    const isRegistered = await this.substrate.query.relayer.registered(
      this.signer.wallet.address
    )
    return isRegistered.toHuman()
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
    const result: ThresholdInfo = []
    for (let i = 0; i < stashKeys.length; i++) {
      const r = await this.substrate.query.stakingExtension.thresholdServers(
        stashKeys[i]
      )
      const convertedResult: any = r.toHuman() ? r.toHuman() : null
      convertedResult ? result.push(convertedResult) : null
    }
    return result
  }
}