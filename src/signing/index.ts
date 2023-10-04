import { ApiPromise } from '@polkadot/api'
import  ExtrinsicBaseClass  from '../extrinsic'
import { Signer } from '../types'
import { SignatureLike } from '@ethersproject/bytes'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { Arch, EncMsg, ValidatorInfo } from '../types'
import { stripHexPrefix, sendHttpPost, sleep } from '../utils'
import { crypto, CryptoLib } from '../utils/crypto'
import { u8ArrayToString } from '../utils'

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

export default class SignatureRequestManager extends ExtrinsicBaseClass {
  adapters: { [key: string | number]: Adapter }
  signer: Signer;
  crypto

  constructor ({ signer, substrate, adapters, crypto}: Config) {
    super({ signer, substrate })
    this.crypto = crypto;
    this.adapters = {
      ...defaultAdapters, 
      ...adapters
    }
  }

  async signTransaction ({ txParams, type, freeTx = true, retries }: SigTxOps) : Promise<SignatureLike> {
    if (!this.adapters[type]) throw new Error(`No transaction adapter for type: ${type} submit as hash`)
    if (!this.adapters[type].preSign) throw new Error(`Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`)

    const sigRequestHash = await this.adapters[type].preSign(txParams)
    const signature = await this.sign({
      sigRequestHash,
      type,
      arch: this.adapters[type].arch,
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
    freeTx = true,
    retries
  }: SigOps): Promise<SignatureLike> {

    const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(sigRequestHash)

    const txRequestData = {  // Ensure this type is imported/defined
      arch,
      transaction_request: sigRequestHash,
      // TODO: ask jesse if this is correct
      free_tx: freeTx,
    }

    const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator: ValidatorInfo, i: number): Promise<EncMsg> => {
      // parse key
      const serverDHKey = await crypto.from_hex(u8ArrayToString(validatorsInfo[i].x25519_public_key))

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

    this.submitTransactionRequest(txRequests)

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

  async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const stashKeys = (await this.substrate.query.stakingExtension.signingGroups.entries())
    .map(([{ args: [group] }, stashKeys]) => {
      const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
      console.log({group: group.toHuman(), stashKeys: stashKeys.unwrap()[0].toHuman(), lenght: stashKeys.unwrap().length, index})
        return stashKeys.unwrap()[index]
      })

    console.log({stashKeys: stashKeys})
    const rawValidatorInfo = await Promise.all(stashKeys.map(stashKey => this.substrate.query.stakingExtension.thresholdServers(stashKey)))

    const validatorsInfo: Array<ValidatorInfo> = rawValidatorInfo.map((validator) => {
      console.log({validator: validator.toHuman()})
      /*
        fuck me, i'm sorry frankie i know this looks bad and you're right
        it does but this is going to require a destruction of polkadotjs as a dependency
        or parsing the return types are selves? but if we do that we might as well not use polkadot js
      */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { x25519PublicKey, endpoint, tssAccount } = validator.toHuman()
      return { x25519_public_key: x25519PublicKey, ip_address: endpoint, tss_account: tssAccount }
    })

    return validatorsInfo
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