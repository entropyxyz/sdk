import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { EncMsg, ValidatorInfo } from '../types'
import { stripHexPrefix, sendHttpPost } from '../utils'
import { crypto, CryptoLib } from '../utils/crypto'
import { Transaction } from 'ethers'

export interface Config {
  signer: Signer
  substrate: ApiPromise
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
}

export interface TxParams {
  [key: string]: Transaction | unknown 
}

export interface SigTxOps {
  txParams: TxParams
  type?: string
}

export interface SigOps {
  sigRequestHash: string
  type?: string
}

/**
 * `SignatureRequestManager` facilitates signature requests using Polkadot/Substrate API.
 * This manager handles transaction signing using pre-defined adapters and cryptographic utilities.
 * 
 */

export default class SignatureRequestManager {
  substrate: ApiPromise
  signer: Signer
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib

  /**
   * Constructs a new instance of the `SignatureRequestManager` class.
   *
   * @param signer - The signer for the transaction.
   * @param substrate - Polkadot/Substrate API instance.
   * @param adapters - Transaction adapters for different transaction types (chain dependent).
   * @param crypto - chachapoly cryptoLib
   */

  constructor ({ signer, substrate, adapters, crypto }: Config) {
    this.substrate = substrate
    this.signer = signer
    this.crypto = crypto
    this.adapters = {
      ...defaultAdapters,
      ...adapters,
    }
  }

  /**
   * Signs a transaction of the specified type.
   *
   * @param txParams - The transaction parameters.
   * @param type - The type of the transaction.
   * 
   * @returns A promise that resolves with the signed transaction.
   * @throws {Error} If an adapter for the given transaction type is not found.
   */

  async signTransaction ({ txParams, type }: SigTxOps): Promise<unknown> {

    if (!this.adapters[type])
      throw new Error(`No transaction adapter for type: ${type} submit as hash`)
    if (!this.adapters[type].preSign)
      throw new Error(
        `Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`
      )

    const sigRequestHash = await this.adapters[type].preSign(txParams)
    const signature = await this.sign({
      sigRequestHash,
      type,
    })
    if (this.adapters[type].postSign) {
      return await this.adapters[type].postSign(signature)
    }

    return signature
  }

  /**
   * Signs the provided request hash.
   *
   * @param sigRequestHash - The request hash to sign.
   * @returns A promise which resolves to the generated signature as a Uint8Array.
   */

  async sign ({ sigRequestHash }: SigOps): Promise<Uint8Array> {
    const strippedsigRequestHash = stripHexPrefix(sigRequestHash)
    const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(
      strippedsigRequestHash
    )

    const txRequests: Array<EncMsg> = await this.formatTxRequests({
      validatorsInfo: validatorsInfo.reverse(),
      strippedsigRequestHash,
    })
    const sigs = await this.submitTransactionRequest(txRequests)
    const sig = sigs[0]
    return Uint8Array.from(atob(sig), (c) => c.charCodeAt(0))
  }

  /**
   * Retrieves the current timestamp split into seconds and nanoseconds.
   * 
   * @returns An object containing `secs_since_epoch` and `nanos_since_epoch`.
   */

  getTimeStamp () {
    const timestampInMilliseconds = Date.now()
    const secs_since_epoch = Math.floor(timestampInMilliseconds / 1000)
    const nanos_since_epoch = (timestampInMilliseconds % 1000) * 1_000_000

    return {
      secs_since_epoch: secs_since_epoch,
      nanos_since_epoch: nanos_since_epoch,
    }
  }

  /**
   * Generates formatted transaction requests suitable for validators.
   *
   * @param strippedsigRequestHash - The signature request hash, with hex prefix stripped.
   * @param validatorsInfo - Information regarding the validators.
   * @returns A promise that resolves to an array of encrypted messages for each validator.
   */

  async formatTxRequests ({
    strippedsigRequestHash,
    validatorsInfo,
  }: {
    strippedsigRequestHash: string
    validatorsInfo: Array<ValidatorInfo>
  }): Promise<EncMsg[]> {
    return await Promise.all(
      validatorsInfo.map(
        async (validator: ValidatorInfo): Promise<EncMsg> => {
          const txRequestData = {
            transaction_request: stripHexPrefix(strippedsigRequestHash),
            validators_info: validatorsInfo,
            timestamp: this.getTimeStamp(),
          }

          const serverDHKey = await crypto.from_hex(validator.x25519_public_key)

          const formattedValidators = await Promise.all(
            validatorsInfo.map(async (v) => {
              return {
                ...v,
                x25519_public_key: Array.from(
                  await crypto.from_hex(v.x25519_public_key)
                ),
              }
            })
          )

          const encoded = Uint8Array.from(
            JSON.stringify({
              ...txRequestData,
              validators_info: formattedValidators,
            }),
            (x) => x.charCodeAt(0)
          )

          const encryptedMessage = await crypto.encrypt_and_sign(
            this.signer.pair.secretKey,
            encoded,
            serverDHKey
          )

          return {
            url: validator.ip_address,
            msg: encryptedMessage,
          }
        }
      )
    )
  }

  /**
   * Sends transaction requests and retrieves the associated signatures.
   *
   * @param txReq - An array of encrypted messages to send as transaction requests.
   * @returns A promise that resolves to an array of signatures in string format.
   */

  async submitTransactionRequest (txReq: Array<EncMsg>): Promise<string[]> {
    return Promise.all(
      txReq.map(async (message: EncMsg) => {
        const parsedMsg = JSON.parse(message.msg)
        const payload = {
          ...parsedMsg,
          msg: stripHexPrefix(parsedMsg.msg),
        }

        const sig = await sendHttpPost(
          `http://${message.url}/user/sign_tx`,
          JSON.stringify(payload)
        )
        return sig[0]
      })
    )
  }

  /**
   * Fetches validator information based on the signature request.
   *
   * @param sigRequest - The provided signature request.
   * @returns A promise that resolves to an array of information related to validators.
   */

  async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const stashKeys = (
      await this.substrate.query.stakingExtension.signingGroups.entries()
    ).map((group) => {
      const stashKeys = group[1]
      // @ts-ignore: next line
      const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
      // @ts-ignore: next line
      return stashKeys.unwrap()[index]
    })

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
        //test

        return {
          x25519_public_key: x25519PublicKey,
          ip_address: endpoint,
          tss_account: tssAccount,
        }
      }
    )

    return validatorsInfo
  }
}
