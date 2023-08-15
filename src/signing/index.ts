import { ApiPromise } from '@polkadot/api'
import { Extrinsic } from '../extrinsic'
import { Signer } from '../types'
import { SignatureLike } from '@ethersproject/bytes'
import { Adapter } from './adapters/types'
import { UserTransactionRequest, Arch, EncMsg, ValidatorInfo } from '../types'
import { stripHexPrefix, sendHttpPost } from '../utils'
import { loadCryptoLib, cryptoIsLoaded } from '../utils/crypto'

export interface Config {
  signer: signer;
  substrate: ApiPromise;
  adapters: { [key: string | number]: adapter };
  crypto: any;
}

export interface SigOps {
  sigRequestHash: string;
  arch: Arch;
  type: string;
  freeTx?: boolean;
  retries?: number;
}

export class SignatureRequestManager extends Extrinsic {
    adapters: { [key: string | number]: Adapter }
    crypto: any
    signer: Signer;
    constructor({ signer, substrate, adapters, crypto }: Config) {
        super({ signer, substrate })
        this.adapters = {
            ...defaultAdapters,  // Uncomment if you have this defined somewhere
            ...adapters
        }
        this.crypto = crypto
    }

    async getArbitraryValidators(sigRequest: string) {
        const stashKeys = (await this.substrate.query.stakingExtension.signingGroups.entries())
            .map(group => {
                const index = parseInt(sigRequest, 16) % group.length
                return group[index]
            })

        return Promise.all(stashKeys.map(stashKey => this.substrate.query.stakingExtension.thresholdServers(stashKey)))
    }

    async sign({
        sigRequestHash,
        arch,
        type,
        freeTx = true,
        retries
    }: sigOps): Promise<SignatureLike> {
        const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(sigRequestHash)

        const txRequestData = {  // Ensure this type is imported/defined
            arch,
            transaction_request: sigRequestHash,
        }

        const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator: ValidatorInfo, i: number) => {
            const serverDHKey = await this.crypto.parseServerDHKey({
                x25519PublicKey: validatorsInfo[i].x25519PublicKey,
            })

            const encoded = Uint8Array.from(
                JSON.stringify({ ...txRequestData, validators_info: validator }),
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

        // Assuming sigHash is derived from sigRequestHash or similar

        txRequests.forEach((req) => {
          const this.submitTransactionRequest(req)
        })

        const signature: SignatureLike = await this.pollNodeForSignature(
          stripHexPrefix(sigRequestHash),
          validatorsInfo[0].ipAddress,
          retries,
        )
        return signature
    }

 /**
   * Submits the transaction request to the threshold server so its constraints can be validated
   *
   * @async
   * @param {Array<EncMsg>} txReq
   * @param {string[]} serversWithPort IP/domain and port of the threshold server, separated by ':'
   * @returns {Promise<>}
   */
  async submitTransactionRequest(txReq: Array<EncMsg>): Promise<void> {
    await Promise.all(
      txReq.map(
        async (message) =>
          await sendHttpPost(`http://${message.url}/user/sign_tx`, message.encMsg)
      )
    )
  }

  /**
   * @deprecated
   *
   * @param {string} sigHash - hash of the message to be signed
   * @param {string} thresholdUrl - url of the threshold server
   * @param {number} retries - number of times to retry
   * @return {*}  {Promise<SignatureLike>} - {@link ThresholdServer}  signature of the message
   * @memberof ThresholdServer
   */
  async pollNodeForSignature(
    sigHash: string,
    thresholdUrl: string,
    retries: number
  ): Promise<SignatureLike> {
    let i = 0
    let status
    let postRequest
    while (status !== 202 && i < retries) {
      try {
        postRequest = await fetch(`http://${thresholdUrl}/signer/signature`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ message: sigHash }),
        })
        status = postRequest.status
      } catch (e) {
        status = 500
      }
      await sleep(3000)
      i++
    }
    const result = await postRequest.text()
    try {
      return Uint8Array.from(atob(result), (c) => c.charCodeAt(0))
    } catch (e) {
      throw new Error(postRequest.statusText)
    }
  }
}