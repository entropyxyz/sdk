import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer, hexString} from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { decodeVecU8ToArrayBuffer} from '../utils'
import { buf2hex, hex2buf } from '../utils'


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

  async get (deployKey = this.signer.wallet.address): Promise<ArrayBuffer> {
    const responseHexOption = await this.substrate.query.constraints.v2Bytecode(deployKey)
    if (responseHexOption.isEmpty) {
      throw new Error("No program defined for the given account.")
    }

    const responseHex = responseHexOption.unwrap().toHex() // Convert Bytes to hex string
    return hex2buf(responseHex) // Convert hex string to ArrayBuffer
  }

  // we're assuming/inferring account/key 
  async set (program: ArrayBuffer): Promise<void> {
    try {
      console.log(this.signer.wallet.address, `this is the key!!!`)
      const hexProgram = buf2hex(program) 

      // ts-ignore
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateV2Constraints(this.signer.wallet.address, hexProgram)
      
      // Send the transaction and wait for the confirmation event.
      await this.sendAndWaitFor(tx, false, {
        section: 'constraints',
        name: 'ConstraintsV2Updated'
      })

    } catch (error) {
      console.error("Error setting program:", error)
      throw error
    }
  } 
}