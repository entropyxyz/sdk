import { ApiPromise } from '@polkadot/api'
import Extrinsic from '../extrinsic'
import { Signer } from '../types'
// TODO CORRECT THESE TYPE LOCATIONS TO BE IN NEW TYPS DIR
import { ITransactionRequest, Arch, EncMsg } from '../threshold-server/types'

import { defaultAdapters } './adapters'
import { Adapter } './adapters/base'

export interface Config {
  signer: Signer;
  substrate: ApiPromise;
  adapters: { [key: string | number] : Adapter };
}

export class SignatureRequestManager extends Extrinsic {
  constructor ({ signer, substrate, adapters }: Config) {
    super(signer, substrate)
    this.adapters = {
      ...defaultAdapters,
      ...adapters
    }
  }

  async getArbitraryValidators () {
     /* this might be a weird thing*/
    const stashKeys = await this.substrate.query.stakingExtension.signingGroups.entries()
    .reduce((agg, group) => {
      const index = parseInt(sigRequest, 16) % group.length
      agg.push(group[index])
    }, [])

    return Promise.all(stashKeys.map((stashKey) =>{
      return this.net.substrate.query.stakingExtension.thresholdServers(stashKey)
    }))
  }

  async sign({sigRequest, arch, freeTx = true, retries}:{
    sigRequestHash: string;
    freeTx?: boolean;
    retries?: number;
  }): Promise<SignatureLike> {
    const validatorsInfo = await this.getArbitraryValidators()

    const txRequests: Array<EncMsg> = []
    const sigRequest: UserTransactionRequest = {
      arch,
      transaction_request: sigRequestHash,
      validator_ips: validatorsInfo.map((validator) => validator.ip_address),
    }

    const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator) => {
      // use buffere from iunit8 to string 'hex'
      const serverDHKey = await this.crypto.parseServerDHKey({
        x25519PublicKey: validatorsInfo[i].x25519PublicKey,
      })

      const encoded = Uint8Array.from(

// FINISH THE FORMAT OF NEW TRANSACTION


        JSON.stringify({
          ...sigRequest
        }),
        (x) => x.charCodeAt(0)
      )

      const encryptedMessage = await this.crypto.encryptAndSign(
        this.signer.pair.secretKey,
        encoded,
        serverDHKey
      )
      return {
        url: validatorsInfo[i].ipAddress,
        encMsg: encryptedMessage,
      }
    }))

    const signature: SignatureLike = await this.thresholdServer.pollNodeForSignature(
      sigHash.slice(2),
      validatorsInfo[0].ipAddress,
      retries
    )
    return signature
  }

}