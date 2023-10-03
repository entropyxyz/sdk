import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer} from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { decodeVecU8ToArrayBuffer} from '../utils'


/**
 * This module provides utility functions for managing programs in the Entropy ecosystem.
 */

/**
 * A class for interfacing with the V2 Entropy Constraints system.
 * 
 * @class ProgramManager
 * @extends ExtrinsicBaseClass
 */

export default class ProgramManager extends ExtrinsicBaseClass {
  substrate: ApiPromise
  signer: Signer 

  /**
   * Creates an instance of ProgramManager.
   *
   * @param {ApiPromise} substrate - The API object for Substrate.
   * @param {Signer} signer - The signer object for the user interfacing with Entropy.
   */

  constructor ({ substrate, signer }) {
    super({substrate, signer})
    this.substrate = substrate
    this.signer = signer
  }

  /**
   * Retrieves the program associated with a given deploy key.
   * 
   * @param {string} [deployKey=this.signer.wallet.address] - The deploy key (address) associated with the program.
   * @returns {Promise<ArrayBuffer>} - A promise that resolves to the program's bytecode.
   * @throws Will throw an error if no program is defined for the given account.
   */

  async get (deployKey = this.signer.wallet.address): Promise<ArrayBuffer> {
    const response = await this.substrate.query.constraints.v2Bytecode(deployKey)
    if (!response) {
      throw new Error("No program defined for the given account.");
    }
    return decodeVecU8ToArrayBuffer(response)
  }

  /**
   * Sets a program for the associated signer's account.
   * 
   * @param {ArrayBuffer} program - The program's bytecode.
   * @throws Will throw an error if unable to set the program.
   */

  async set (program: ArrayBuffer): Promise<void> {
    try {
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.v2Bytecode(program)
    
      await this.sendAndWaitFor(tx, true, {
        section: 'Programs',
        name: 'ProgramSet' 
      });

    } catch (error) {
      console.error("Error setting program:", error)
      throw error
    }
  } 
}