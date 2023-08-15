import { ApiPromise } from '@polkadot/api'
import { AnyJson } from '@polkadot/types-codec/types'
import { getApi } from './utils'
import { StashKeys, ThresholdInfo, Address } from './types'
import { ServerInfo } from '../types'

/**
 *
 * A class for interfacing with Entropy's blockchain, read only functions
 * does not require a private key to use
 */
export class SubstrateRead {
  /**
   *
   *
   * @type {ApiPromise} the api object for an Entropy chain
   * @memberof SubstrateRead
   */
  substrate: ApiPromise

  /**
   * Creates an instance of SubstrateRead.
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class does not require a user wallet
   * @param {ApiPromise} api - The {@link ApiPromise} object for an Entropy blockchain
   */
  constructor (api: ApiPromise) {
    this.substrate = api
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   *
   * @static
   * @param {string} [endpoint='ws://127.0.0.1:9944'] web socket address will default to localhost:9944
   * @returns {*}  {Promise<SubstrateRead>} a {@link SubstrateRead} object
   */
  static async setup (endpoint?: string): Promise<SubstrateRead> {
    const api = await getApi(endpoint)
    return new SubstrateRead(api)
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

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Gets all stash keys split up into signing subgroups from chain
   *
   * @returns {*}  {Promise<any[]>} A promise of non converted stash keys
   * @memberof SubstrateRead
   */
  async getStashKeys (): Promise<any[]> {
    const stashKeys = await this.substrate.query.stakingExtension.signingGroups.entries()
    return stashKeys
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Gets one key from every signing subgroup
   *
   * @param {*} stashKeys - An array of stash keys to query
   * @returns {*}  {StashKeys} An array of stash keys
   */
  selectStashKeys (stashKeys: any): StashKeys {
    return stashKeys.reduce((agg, keyInfo) => {
      // TODO: currently picks first stash key in group (second array item is set to 0)
      // create good algorithm for randomly choosing a threshold server
      agg.push(keyInfo[1].toHuman()[0])
    }, [])
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Checks if an account is registering
   *
   * @param {Address} address - The address that is being checked if registered
   * @returns {*}  {Promise<AnyJson>} An object that contains the account if it was registered
   */
  async isRegistering (address: Address): Promise<AnyJson> {
    const result = await this.substrate.query.relayer.registering(address)
    return result.toHuman()
  }

  /**
   * @alpha
   *
   * @remarks
   * This function is part of the {@link SubstrateRead} class
   * Checks if an account is registered
   *
   * @param {Address} address - The address that is being checked if registered
   * @returns {*}  {Promise<boolean>} An object that contains the account if it was registered
   */
  async isRegistered (address: Address): Promise<boolean> {
    const result = await this.substrate.query.relayer.registered(address)
    // check to see if result.toHuman returns an object
    return !!result.toHuman().is_registering
  }
}