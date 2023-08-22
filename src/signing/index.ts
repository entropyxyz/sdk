import { ApiPromise } from '@polkadot/api'
import { Extrinsic } from '../extrinsic'
import { Signer } from '../types'
import { SignatureLike } from '@ethersproject/bytes'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { UserTransactionRequest, Arch, EncMsg, ValidatorInfo, x25519PublicKey } from '../types'
import { stripHexPrefix, sendHttpPost, sleep } from '../utils'
import { crypto, CryptoLib } from '../utils/crypto'

export interface Config {
  signer: Signer;
  substrate: ApiPromise;
  adapters: { [key: string | number]: Adapter };
  crypto: CryptoLib;
}

export interface TxParams {
  [key: string]: any;
}

export interface SigTxOps {
  txParams: TxParams
  type?: string;
  freeTx?: boolean;
  retries?: number;
}

export interface SigOps {
  sigRequestHash: string;
  arch?: Arch;
  type?: string;
  freeTx?: boolean;
  retries?: number;
}

export default class SignatureRequestManager extends Extrinsic {
  adapters: { [key: string | number]: Adapter }
  signer: Signer;
  crypto

  constructor ({ signer, substrate, adapters, crypto}: Config) {
    super({ signer, substrate })
    this.crypto = crypto;
    this.adapters = {
      ...defaultAdapters,  // Uncomment if you have this defined somewhere
      ...adapters
    }
  }

  async getArbitraryValidators (sigRequest: string) {
    const stashKeys = (await this.substrate.query.stakingExtension.signingGroups.entries())
      .map(group => {
        const index = parseInt(sigRequest, 16) % group.length
        return group[index]
      })

    return Promise.all(stashKeys.map(stashKey => this.substrate.query.stakingExtension.thresholdServers(stashKey)))
  }
  


  async signTransaction ({ txParams, type, freeTx = true, retries }: SigTxOps) : Promise<SignatureLike> {
    if (!this.adapters[type]) throw new Error(`No transaction adapter for type: ${type} submit as hash`)
    if (!this.adapters[type].preSign) throw new Error(`Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`)

    const sigRequestHash = await this.adapters[type]
    const signature = await this.sign({
      sigRequestHash,
      type,
      arch: this.adapters[type].arch || type,
      freeTx,
      retries,

    })
    if (this.adapters[type].postSign) {
      return await this.adapters[type].postSign(signature)
    }

    return signature
  }
  /**
   *
   * Sign a tx (for ethereum currently) using the entropy blockchain. This will take an unsigned tx and return
   * a signature, it is up to the user to handle from there
   *
   * @param {utils.UnsignedTransaction} tx - {@link UnsignedTransaction} - The transaction to be signed
   * @param {boolean} freeTx - use the free tx pallet
   * @param {number} retries - To be deprecated when alice signs with the validators, but polling for sig retries
   * @return {*}  {Promise<SignatureLike>} {@link SignatureLike} - A signature to then be included in a transaction
   */

  async sign ({
    sigRequestHash,
    arch,
    type,
    freeTx = true,
    retries
  }: SigOps): Promise<SignatureLike> {

    const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(sigRequestHash)

    const txRequestData = {  // Ensure this type is imported/defined
      arch,
      transaction_request: sigRequestHash,
    }

    const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator: ValidatorInfo, i: number): Promise<EncMsg> => {
      const serverDHKey = await crypto.parseServerDHKey({
        x25519_public_key: validatorsInfo[i].x25519_public_key,
      })

      const encoded = Uint8Array.from(
        JSON.stringify({ ...txRequestData, validators_info: validator }),
        (x) => x.charCodeAt(0)
      )

      const encryptedMessage = await crypto.encrypt_and_sign(
        this.signer.pair.secretKey,
        encoded,
        serverDHKey
      )

      return {
        url: validatorsInfo[i].ip_address,
        encMsg: encryptedMessage,
      }
    }))

    // Assuming sigHash is derived from sigRequestHash or similar

    txRequests.forEach((req) => {
      this.submitTransactionRequest(req)
    })

    const signature: SignatureLike = await this.pollNodeForSignature(
      stripHexPrefix(sigRequestHash),
      validatorsInfo[0].ip_address,
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
  async submitTransactionRequest (txReq: Array<EncMsg>): Promise<void> {
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
  async pollNodeForSignature (
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
      // TODO: DONT USE SLEEP maybe uses blocks from substrate as a timer?
      // or something a little less arbitrary
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