import { Signer, Address } from '../substrate/types'
import { getWallet, getApi, Substrate } from '../substrate'
import { ApiPromise } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/types'

/**
 * @alpha
 * @remarks
 * This is the {@link Constraint} class
 * A class for interfacing with the Entropy Constraint system
 */
export class Constraints extends Substrate {
  /**
   * @alpha
   * @remarks
   * This function is part of the {@link Constraints} class
   * Creates an instance of Constraints.
   *
   * @param {ApiPromise} api - The api object for an Entropy blockchain
   * @param {Signer} signer - The signer object for the user interfacing with the Entropy blockchain
   */
  constructor(api: ApiPromise, signer: Signer) {
    super(api, signer)
    this.api = api
    this.signer = signer
  }

  /**
   * @alpha
   * @remarks
   * This function is part of the {@link Constraints} class
   * Static function to setup a Constraint instance
   *
   * @static
   * @param {string} seed - Private key for wallet
   * @param {string} [endpoint] - endpoint websocket address, optional will default to localhost:9944
   * @returns {*}  {Promise<Constraint>} - A promise that resolves to a Constraint object
   */
  static async setup(seed: string, endpoint?: string): Promise<Constraints> {
    const api = await getApi(endpoint)
    const wallet = await getWallet(seed)
    return new Constraints(api, wallet)
  }

  /**
   * @alpha
   * @remarks
   * This function updates the access control list for a user
   *
   * @param {any} accessControlInfo - The access control info to add for a user
   * @param {Address} entropyAccount - The Account to modify the constraint for
   * @returns {*}  {Promise<EventRecord>} - a promise that contains the event that fits the filter
   */
  async updateAccessControlList(
    accessControlInfo: any,
    entropyAccount: Address,
    freeTx?: boolean
  ): Promise<EventRecord> {
    // TODO JH after typegen, typed Addresses and use new constraints structs
    // query constraints pallet to get list of users they can modify constraints for
    // throw error if multiple accounts and no entropyAccount is passed in
    // update constraints for that user

    return this.sendAndWaitFor(
      this.api.tx.constraints.updateConstraints(
        entropyAccount,
        accessControlInfo
      ),
      freeTx,
      {
        section: 'constraints',
        name: 'ConstraintsUpdated',
      }
    )
  }

  /**
   * @alpha
   * @remarks
   * This function updates the access control list for a user
   *
   * @param {Address} entropyAccount - The Account to check the constraint for
   * @returns {Promise<any>} - A promise that returns the current evm ACL
   * @TODO generalize for any architecture
   */
  async getEvmAcl(entropyAccount: Address): Promise<any> {
    // TODO JH after typegen, typed Addresses and use new constraints structs
    return this.api.query.constraints.evmAcl(entropyAccount)
  }
}
