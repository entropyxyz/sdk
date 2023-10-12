import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer, hexString} from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { decodeVecU8ToArrayBuffer} from '../utils'
import { buf2hex, hex2buf } from '../utils'
import * as util from '@polkadot/util'


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
    
    const responseHex = responseHexOption.unwrap().toHex()  // Get the hex representation
    const byteBuffer = hex2buf(responseHex) // Convert hex string to ArrayBuffer
    return byteBuffer
  }

  // // we're assuming/inferring account/key 
  // async set (program: ArrayBuffer): Promise<void> {
  //   try {
  //     // note for later
  //     // https://github.com/entropyxyz/x25519-chacha20poly1305/blob/main/pkg/x25519_chacha20poly1305.js#L73

  //     // ts-ignore
  //     const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateV2Constraints(this.signer.wallet.address, new Uint8Array(program))
      
  //     // Send the transaction and wait for the confirmation event.
  //     await this.sendAndWaitFor(tx, false, {
  //       section: 'constraints',
  //       name: 'ConstraintsV2Updated'
  //     })

  //   } catch (error) {
  //     console.error("Error setting program:", error)
  //     throw error
  //   }
  // } 

  async set (program: ArrayBuffer): Promise<void> {
    try {
      
      // Convert ArrayBuffer to Uint8Array and then to Hex
      const programHex = util.u8aToHex(new Uint8Array(program))
        
      // Create the transaction
      const tx: SubmittableExtrinsic<'promise'> = this.substrate.tx.constraints.updateV2Constraints(this.signer.wallet.address, programHex)
      
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