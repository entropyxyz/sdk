import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer} from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { decodeVecU8ToArrayBuffer} from '../utils'


/**
 * @alpha
 * @remarks
 * This is the {@link ProgramManager} class
 * A class for interfacing with the V2 Entropy Constraints system
 */
export default class ProgramManager extends ExtrinsicBaseClass {
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

  // signer is one key pair. we can assume that its the key that we're setting it too. we're only setting one user gets one program. 

  async get (deployKey = this.signer.wallet.address): Promise<ArrayBuffer> {
    // TODO: Check with jake on this
    const response = await this.substrate.query.constraints.v2Bytecode(deployKey);
    if (!response) {
      throw new Error("No program defined for the given account."); 
    }
    return decodeVecU8ToArrayBuffer(response);
  }

  // we're assuming/inferring account/key 
  async set (program: ArrayBuffer): Promise<void> {
    try {
      console.log(this.signer.wallet.address, `this is the key!!!`)
      // ts-ignore
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateV2Constraints(this.signer.wallet.address, new Uint8Array(program));
      
      // Send the transaction and wait for the confirmation event.
      await this.sendAndWaitFor(tx, false, {
        section: 'constraints',
        name: 'ConstraintsV2Updated'
      });

    } catch (error) {
      console.error("Error setting program:", error);
      throw error;
    }
  } 
}