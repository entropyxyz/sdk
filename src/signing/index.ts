import { ApiPromise } from '@polkadot/api'
import ExtrinsicBaseClass from '../extrinsic'
import { Signer } from '../types'
import { SignatureLike } from '@ethersproject/bytes'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { Arch, EncMsg, ValidatorInfo } from '../types'
import { stripHexPrefix, sendHttpPost, sleep } from '../utils'
import { crypto, CryptoLib } from '../utils/crypto'
import { serializeTransaction } from 'ethers/lib/utils'
import { ethers } from 'ethers'
import { keccak256 } from 'ethers/lib/utils'

export interface Config {
  signer: Signer
  substrate: ApiPromise
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
}

export interface TxParams {
  [key: string]: any
}

export interface SigTxOps {
  txParams: TxParams
  type?: string
  freeTx?: boolean
  retries?: number
}

export interface SigOps {
  sigRequestHash: string
  arch?: Arch
  type?: string
  freeTx?: boolean
  retries?: number
}

export default class SignatureRequestManager extends ExtrinsicBaseClass {
  adapters: { [key: string | number]: Adapter }
  signer: Signer
  crypto

  constructor ({ signer, substrate, adapters, crypto }: Config) {
    super({ signer, substrate })
    this.crypto = crypto
    this.adapters = {
      ...defaultAdapters,
      ...adapters,
    }
  }

  // async signTransaction ({
  //   txParams,
  //   type,
  //   freeTx = true,
  //   retries,
  // }: SigTxOps): Promise<SignatureLike> {
  //   if (!this.adapters[type])
  //     throw new Error(`No transaction adapter for type: ${type} submit as hash`)
  //   if (!this.adapters[type].preSign)
  //     throw new Error(
  //       `Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`
  //     )

  //   const sigRequestHash = await this.adapters[type].preSign(txParams)
  //   const signature = await this.sign({
  //     sigRequestHash,
  //     type,
  //     arch: this.adapters[type].arch,
  //     freeTx,
  //     retries,
  //   })
  //   if (this.adapters[type].postSign) {
  //     return await this.adapters[type].postSign(signature)
  //   }

  //   return signature
  // }
  async signTransaction ({
    txParams,
    type,
    freeTx = true,
    retries,
  }:  SigTxOps ):  Promise<SignatureLike> {
    const serializedTx = serializeTransaction(txParams) // Assuming txParams is your Ethereum transaction
    const hexEncodedTx = ethers.utils.hexlify(serializedTx)
    const generatedSigRequestHash = keccak256(hexEncodedTx)
    if (!this.adapters[type])
      throw new Error(`No transaction adapter for type: ${type} submit as hash`)
    if (!this.adapters[type].preSign)
      throw new Error(
        `Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`
      )
    const signature = await this.sign({
      sigRequestHash: generatedSigRequestHash,
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
    retries,
  }: SigOps): Promise<SignatureLike> {
    const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(
      sigRequestHash
    )

    // const txRequestData = {
    //   // Ensure this type is imported/defined
    //   arch,
    //   transaction_request: sigRequestHash,
    //   // TODO: ask jesse if this is correct
    //   free_tx: freeTx,
    // }

    const txRequestData = {
      arch,
      transaction_request: sigRequestHash,
      validators_info: validatorsInfo,
      timestamp: new Date().toISOString(),
      free_tx: freeTx,
    }

    const txRequests: Array<EncMsg> = await Promise.all(
      validatorsInfo.map(
        async (validator: ValidatorInfo, i: number): Promise<EncMsg> => {
          // parse key
          const serverDHKey = await crypto.from_hex(
            validatorsInfo[i].x25519_public_key
          )

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
        }
      )
    )

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
      txReq.map(async (message) => {
        console.log(`URL: http://${message.url}/user/sign_tx`);

        let parsedMsg;
        try {
          parsedMsg = JSON.parse(message.encMsg);
        } catch (error) {
          console.error('Failed to parse encMsg as JSON:', error);
          return;  // Exit early on error
        }

        console.log('Parsed Message:', parsedMsg);  // Log the parsed message

        // extract fields from parsedMsg
        const { msg, sig, pk, recip, a, nonce } = parsedMsg;

        // Convert arrays to hexadecimal strings as needed
        const hexMsg = this.arrayToHex(parsedMsg.msg)
        const hexSig = this.arrayToHex(parsedMsg.sig)
        const hexPk = this.arrayToHex(parsedMsg.pk)
        const hexRecip = this.arrayToHex(parsedMsg.recip)
        const hexA = this.arrayToHex(parsedMsg.a)
        const hexNonce = this.arrayToHex(parsedMsg.nonce)

        // Construct the payload
        const payload = {
          msg: hexMsg,
          sig: hexSig,
          pk: hexPk,
          recip: hexRecip,
          a: hexA,
          nonce: hexNonce,
        }

        console.log('Payload!!!!!!:', JSON.stringify(payload))

        const expectedProps = ['msg', 'sig', 'pk', 'recip', 'a', 'nonce'];
        for (const prop of expectedProps) {
          if (!Object.prototype.hasOwnProperty.call(parsedMsg, prop)) {
            console.error(`parsedMsg is missing property: ${prop}`);
            return;  
          }
        }
        await sendHttpPost(
          `http://${message.url}/user/sign_tx`,
          JSON.stringify(payload)
        )
      })
    )
  }

  private arrayToHex (array: number[]): string {
    return array.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, '0'),
      '0x'
    )
  }
  async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const stashKeys = (
      await this.substrate.query.stakingExtension.signingGroups.entries()
    ).map(
      ([
        {
          args: [group],
        },
        stashKeys,
      ]) => {
        const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
        return stashKeys.unwrap()[index]
      }
    )

    const rawValidatorInfo = await Promise.all(
      stashKeys.map((stashKey) =>
        this.substrate.query.stakingExtension.thresholdServers(stashKey)
      )
    )

    const validatorsInfo: Array<ValidatorInfo> = rawValidatorInfo.map(
      (validator) => {
        /*
        fuck me, i'm sorry frankie i know this looks bad and you're right
        it does but this is going to require a destruction of polkadotjs as a dependency
        or parsing the return types are selves? but if we do that we might as well not use polkadot js
      */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { x25519PublicKey, endpoint, tssAccount } = validator.toHuman()
        return {
          x25519_public_key: x25519PublicKey,
          ip_address: endpoint,
          tss_account: tssAccount,
        }
      }
    )

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
    retries: number,
  ): Promise<SignatureLike> {
    if (!sigHash) {
      throw new Error('sigHash cannot be null or undefined')
    }

    let i = 0
    let status
    let postRequest


    while (status !== 204 && i < retries) {
      console.log('Entering pollNodeForSignature')
      try {
        console.log('Before fetch request')
        postRequest = await fetch(`http://${thresholdUrl}/user/sign_tx`, {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({ sig: sigHash}), 
        })

        status = postRequest.status
        if (status === 404) {
          console.error('404 Not Found: user/sign_tx endpoint not found.')
          break
        }

        if (status === 422) {
          const result = await postRequest.text()
          console.error('Error: ', result)
          throw new Error(
            `Server responded with status 422 - Unprocessable Entity: ${result}`
          )
        }
      } catch (e) {
        status = 500
        console.error('Error in pollNodeForSignature:', e.message)
      }
      console.log(`\x1b[33m STATUS: ${status} \x1b[0m`)
      await sleep(3000)
      i++
    }

    if (!postRequest.ok) {
      console.error('Error: postRequest is not ok', postRequest)
      throw new Error(`Server responded with status ${postRequest.status}`)
    }

    const resultText = await postRequest.text()
    console.log('Server Response!!!!!!:', resultText)

    if (postRequest.status !== 200) {
      console.error('Error: ', resultText)
      throw new Error(
        `Server responded with status ${postRequest.status}: ${resultText}`
      )
    }

    try {
      return Uint8Array.from(atob(resultText), (c) => c.charCodeAt(0))
    } catch (e) {
      throw new Error('Error decoding response: ' + e.message)
    }
  }
}
