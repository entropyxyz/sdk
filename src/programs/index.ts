import Extrinsic from "../extrinsic";
import { ApiPromise } from '@polkadot/api'
import { Signer} from '../types'
import { getWallet } from '../keys'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { getApi } from "../utils";
import { decodeVecU8ToArrayBuffer} from '../utils'


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


  // set up functions in entropy class 

  // double check Jake's gets/sets. programs arent implemented in threshold so these methods are not valid yet. more relevant when programs running threshold
  // signer is one key pair. we can assume that its the key that we're setting it too. we're only setting one user gets one program. 

  async get (): Promise<ArrayBuffer> {
    const deployKey = this.signer.wallet // double check this. 
    const response = await this.substrate.query.constraints.v2_bytecode();
    if (!response) {
      throw new Error("No program defined for the given account."); 
    }
    return decodeVecU8ToArrayBuffer(response);
  }

  // we're assuming/inferring entropy account/key 
  async set (program: ArrayBuffer): Promise<void> {
    try {
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.v2_bytecode(program);
      
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