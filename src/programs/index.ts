import Extrinsic from "../extrinsic";
import { ApiPromise } from '@polkadot/api'
import { Address } from "../types";
import { Signer} from '../types'
import { getWallet } from '../keys'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { getApi } from "../utils";
import { EventRecord } from "@polkadot/types/interfaces";


/**
 * @alpha
 * @remarks
 * This is the {@link ProgramManager} class
 * A class for interfacing with the V1 Entropy Constraints system
 */
export default class ProgramManager extends Extrinsic {
  /**
   * @alpha
   * @remarks
   * This function is part of the {@link ProgramManager} class
   * Creates an instance of ProgramManager.
   *
   * @param {ApiPromise} substrate - The api object for an Entropy blockchain
   * @param {Signer} signer - The signer object for the user interfacing with the Entropy blockchain
   */

  substrate: ApiPromise
  signer: Signer 

  constructor ({ substrate, signer }) {
    super({substrate, signer})
    this.substrate = substrate
    this.signer = signer
  }

  static async setup (seed: string, endpoint?: string): Promise<ProgramManager> {
    const apiFactory = await getApi();
    const substrate = await apiFactory(endpoint);
    const signer = await getWallet(seed);
    return new ProgramManager({ substrate, signer });
  }

  async getPrograms (entropyAccount: Address): Promise<any> {

    return this.substrate.query.constraints.programs(entropyAccount);
  }

  async setPrograms (entropyAccount: Address, programs: any): Promise<void> {

    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.setPrograms(entropyAccount, programs);

    await this.sendAndWaitFor(tx, true, {
      section: 'Programs',
      name: 'ProgramSet' 
    });
  }
  
  async getEvmAcl (entropyAccount: Address): Promise<any> {
    return this.substrate.query.constraints.evmAcl(entropyAccount)
  }

  async updateAccessControlList (
    accessControlInfo: any,
    entropyAccount: Address,
    freeTx?: boolean
  ): Promise<EventRecord> {
    const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateConstraints(entropyAccount, accessControlInfo);
    return this.sendAndWaitFor(tx, freeTx || false, {
      section: 'Programs',
      name: 'ProgramsUpdated',
    });

  }}    