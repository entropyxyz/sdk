import Extrinsic from "../extrinsic";
import { ApiPromise } from '@polkadot/api'
import { Address } from "../types";
import { Signer} from '../types'
import { getWallet } from '../keys'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { getApi } from "../utils";
import { EventRecord } from "@polkadot/types/interfaces";
import { Codec, AnyJson } from "@polkadot/types-codec/types";
import { decodeVecU8ToArrayBuffer, decodeArrayBufferToString} from '../utils'


/**
 * @alpha
 * @remarks
 * This is the {@link ProgramManager} class
 * A class for interfacing with the V2 Entropy Constraints system
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

  // double check Jake's gets/sets. programs arent implemented in threshold so these methods are not valid yet. more relevant when programs running threshold

  async getProgram (entropyAccount: Address): Promise<ArrayBuffer> {
    const response = await this.substrate.query.constraints.v2_bytecode(entropyAccount);
    if (!response) {
      throw new Error("No program defined for the given account.");
    }
    const program: ArrayBuffer = decodeVecU8ToArrayBuffer(response);
    return program;
  }

  async setProgram (entropyAccount: Address, program: ArrayBuffer): Promise<void> {
    try {
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.v2_bytecode(entropyAccount, program);
      
      // Send the transaction and wait for the confirmation event.
      await this.sendAndWaitFor(tx, true, {
        section: 'Programs',
        name: 'ProgramSet' 
      });

    } catch (error) {
      console.error("Error setting program:", error);
      throw error;
    }
  } 
}