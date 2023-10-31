import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf } from '../utils'
import * as util from '@polkadot/util'

/**
 * @remarks
 * The ProgramManager class provides an interface to interact with the V2 Entropy Programs. 
 * @alpha
 */
export default class ProgramManager extends ExtrinsicBaseClass {
  /**
   * Creates an instance of ProgramManager.
   * @param {ApiPromise} substrate - The API object 
   * @param {Signer} signer - The signer object for the user interfacing with Substrate
   * @remarks
   * The constructor initializes the substrate and signer api. 
   * @alpha
   */
  constructor ({ substrate, signer }: { substrate: ApiPromise; signer: Signer }) {
    super({ substrate, signer })
    this.substrate = substrate
    this.signer = signer
  }

  /**
   * Retrieves the program associated with a given deployKey (account) 
   * @param {string} deployKey - The account key, defaulting to the signer's wallet address if not provided.
   * @returns {Promise<ArrayBuffer>} - The program as an ArrayBuffer.
   * @throws Will throw an error if no program is defined for the given account.
   * @remarks
   * This method communicates with substrate to fetch bytecode associated with an account. 
   * The response is then processed and converted to an ArrayBuffer before being returned 
   * @alpha
   */

  async get (deployKey = this.signer.wallet.address): Promise<ArrayBuffer> {
    const responseHexOption = await this.substrate.query.constraints.v2Bytecode(
      deployKey
    )
    if (responseHexOption.isEmpty) {
      throw new Error('No program defined for the given account.')
    }
    // @ts-ignore: next line
    const responseHex = responseHexOption.unwrap().toHex() // Get the hex representation
    const byteBuffer = hex2buf(responseHex) // Convert hex string to ArrayBuffer
    return byteBuffer
  }

  /**
   * Sets or updates a program for the current signer's account on Substrate.
   * @param {ArrayBuffer} program - The program to be set or updated, as an ArrayBuffer.
   * @returns {Promise<void>}
   * @throws Will throw an error if there's an issue setting the program.
   * @remarks
   * This method takes a program in the form of an ArrayBuffer, converts it (so it can be passed to substrate), and prepares a transaction to set or update the program 
   * for the associated account. After preparing the transaction, it's sent to substrate, and the method waits for a confirmation event.
   * @alpha
   */

  async set (program: ArrayBuffer): Promise<void> {
    try {

      // Convert ArrayBuffer to Uint8Array and then to Hex
      const programHex = util.u8aToHex(new Uint8Array(program))
      // Create the transaction
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateV2Constraints(
        this.signer.wallet.address,
        programHex
      )
      // Send the transaction and wait for the confirmation event.
      await this.sendAndWaitFor(tx, false, {
        section: 'constraints',
        name: 'ConstraintsV2Updated',
      })
    } catch (error) {
      console.error('Error setting program:', error)
      throw error
    }
  }
}
