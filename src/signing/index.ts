import { ApiPromise } from '@polkadot/api'
import { Signer } from '../keys/types/internal'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { EncMsg, ValidatorInfo } from '../types/internal'
import { stripHexPrefix, sendHttpPost } from '../utils'
import { crypto } from '../utils/crypto'
import { AuxData } from './adapters/device-key-proxy'
import { CryptoLib } from '../utils/crypto/types'
import { toHex } from '../utils/index'
export interface Config {
  signer: Signer
  substrate: ApiPromise
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
}

export interface MsgParams {
  [key: string]: unknown
}

export interface SigMsgOps {
  msg: MsgParams
  type?: string
}

export interface SigOps {
  sigRequestHash: string
  hash: string
  type?: string
  auxilaryData?: AuxData[]
}

/**
 * A class to manage the creation, signing, and verification of signature requests.
 */
export interface UserSignatureRequest {
  message: string
  auxilary_data?: any
  validatorsInfo: ValidatorInfo[]
  timestamp: { secs_since_epoch: number; nanos_since_epoch: number }
  hash: string
  signature_verifying_key: number[]
}

/**
 * Constructs a SignatureRequestManager instance.
 *
 * @param {Config} config - The configuration for the SignatureRequestManager.
 * @param {Signer} config.signer - The Signer instance.
 * @param {ApiPromise} config.substrate - The Substrate API instance.
 * @param {Adapter} config.adapters - The adapters for handling different types of transactions.
 * @param {CryptoLib} config.crypto - The cryptographic library.
 */

export default class SignatureRequestManager {
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
  signer: Signer
  substrate: ApiPromise

  /**
   * Initializes a new instance of `SignatureRequestManager`.
   *
   * @param {Config} config - Configuration settings for the manager.
   * @param {Signer} config.signer - The signer for authorizing transactions.
   * @param {ApiPromise} config.substrate - Instance of the Polkadot/Substrate API.
   * @param {Adapter[]} config.adapters - Set of adapters for handling different types of transactions.
   * @param {CryptoLib} config.crypto - Instance of CryptoLib for cryptographic operations.
   */

  constructor ({ signer, substrate, adapters, crypto }: Config) {
    this.signer = signer
    this.substrate = substrate
    this.crypto = crypto
    this.adapters = {
      ...defaultAdapters,
      ...adapters,
    }
  }

  /**
   * Retrieves the primary verifying key of the signer.
   *
   * @returns {string | undefined} The primary verifying key if available, otherwise undefined.
   */

  get verifyingKey () {
    return this.signer.verifyingKeys ? this.signer.verifyingKeys[0] : undefined
  }

  /*



            DO NOT DELET THIS CODE BLOCK!

    Signs a message using the appropriate adapter.

    @param {SigMsgOps} params - The message and type for signing.
    @param {TxParams} SigMsgOps.txParams - The parameters of the transaction to be signed.
    @param {string} [sigTxOps.type] - The type of transaction.
    @returns {Promise<unknown>} A promise resolving with the signed transaction.
    @throws {Error} If no adapter or preSign function is found for the given type.
   */

  async signWithAdapter ({ msg, type }: SigMsgOps): Promise<unknown> {
    if (!this.adapters[type])
      throw new Error(`No transaction adapter for type: ${type} submit as hash`)
    if (!this.adapters[type].preSign)
      throw new Error(
        `Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`
      )

    const { sigRequestHash, auxilary_data } = await this.adapters[type].preSign(
      this.signer,
      msg
    )

    const signature = await this.sign({
      sigRequestHash,
      hash: this.adapters[type].hash,
      auxilaryData: auxilary_data as AuxData[],
    })
    if (this.adapters[type].postSign) {
      return await this.adapters[type].postSign(signature, msg)
    }
    return signature
  }

  /**
   * Signs a given signature request hash.
   *
   * @param {SigOps} sigOps - Parameters for the signature operation.
   * @param {string} sigOps.sigRequestHash - The hash of the signature request to be signed.
   * @param {string} [sigOps.hash] - The hash type.
   * @param {unknown[]} [sigOps.auxilaryData] - Additional data for the signature operation.
   * @param {signatureVerifyingKey} signatureVerifyingKey - The verifying key for the signature requested
   * @returns {Promise<Uint8Array>} A promise resolving to the signed hash as a Uint8Array.
   */

  async sign ({
    sigRequestHash,
    hash,
    auxilaryData,
  }: SigOps): Promise<Uint8Array> {
    const strippedsigRequestHash = stripHexPrefix(sigRequestHash)
    const validatorsInfo: Array<ValidatorInfo> = await this.pickValidators(
      strippedsigRequestHash
    )
    // TO-DO: this needs to be and accounId ie hex string of the address
    // which means you need a new key ie device key here

    const signatureVerifyingKey = this.verifyingKey
    console.log({ auxilaryData })
    const txRequests: Array<EncMsg> = await this.formatTxRequests({
      strippedsigRequestHash,
      auxilaryData,
      validatorsInfo: validatorsInfo,
      hash,
      signatureVerifyingKey,
    })
    const sigs = await this.submitTransactionRequest(txRequests)
    const sig = await this.verifyAndReduceSignatures(sigs)
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
   * Generates transaction requests formatted for validators.
   *
   * @param {object} params - Parameters for generating the transaction request.
   * @param {string} params.strippedsigRequestHash - Stripped signature request hash.
   * @param {unknown[]} [params.auxilaryData] - Additional data for the transaction request.
   * @param {ValidatorInfo[]} params.validatorsInfo - Information about the validators.
   * @param {string} [params.hash] - The hash type.
   * @param {signatureVerifyingKey[]} params.signatureVerifyingKey - The verifying key for the signature requested
   * @returns {Promise<EncMsg[]>} A promise that resolves to the formatted transaction requests.
   */

  async formatTxRequests ({
    strippedsigRequestHash,
    auxilaryData,
    validatorsInfo,
    hash,
    signatureVerifyingKey,
  }: {
    strippedsigRequestHash: string
    auxilaryData?: unknown[]
    validatorsInfo: Array<ValidatorInfo>
    hash?: string
    signatureVerifyingKey: string
  }): Promise<EncMsg[]> {
    return await Promise.all(
      validatorsInfo.map(async (validator: ValidatorInfo): Promise<EncMsg> => {
        // TODO: auxilaryData full implementation
        const txRequestData: UserSignatureRequest = {
          message: stripHexPrefix(strippedsigRequestHash),
          auxilary_data: auxilaryData,
          validatorsInfo: validatorsInfo,
          timestamp: this.getTimeStamp(),
          hash,
          signature_verifying_key: Array.from(
            Buffer.from(stripHexPrefix(signatureVerifyingKey), 'hex')
          ),
        }
        if (auxilaryData) console.log('hree')
        // TODO handle array here
        txRequestData.auxilary_data = [toHex(JSON.stringify(auxilaryData[0]))]

        console.log({ test: txRequestData })
        const serverDHKey = await crypto.fromHex(validator.x25519_public_key)

        const formattedValidators = await Promise.all(
          validatorsInfo.map(async (v) => {
            return {
              ...v,
              x25519_public_key: Array.from(
                await crypto.fromHex(v.x25519_public_key)
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

        const encryptedMessage = await crypto.encryptAndSign(
          this.signer.pair.secretKey,
          encoded,
          serverDHKey
        )

        return {
          msg: encryptedMessage,
          url: validator.ip_address,
          tss_account: validator.tss_account,
          // signature_verifying_key: signatureVerifyingKey,
        }
      })
    )
  }

  /**
   * Sends transaction requests and retrieves the associated signatures.
   *
   * @param {EncMsg[]} txReq - An array of encrypted messages to send as transaction requests.
   * @returns {Promise<string[][]>} A promise that resolves to an array of arrays of signatures in string format.
   */

  async submitTransactionRequest (txReq: Array<EncMsg>): Promise<string[][]> {
    return Promise.all(
      txReq.map(async (message: EncMsg) => {
        // Extract the required fields from parsedMsg
        const parsedMsg = JSON.parse(message.msg)
        const payload = {
          ...parsedMsg,
          msg: parsedMsg.msg,
        }
        const sigProof = (await sendHttpPost(
          `http://${message.url}/user/sign_tx`,
          JSON.stringify(payload)
        )) as string[]
        sigProof.push(message.tss_account)
        return sigProof
      })
    )
  }

  /**
   * Selects validators based on the signature request.
   *
   * @param {string} sigRequest - The signature request hash.
   * @returns {Promise<ValidatorInfo[]>} A promise resolving to an array of validator information.
   */

  async pickValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const entries =
      await this.substrate.query.stakingExtension.signingGroups.entries()
    const stashKeys = entries.map((group) => {
      const keyGroup = group[1]
      // omg polkadot type gen is a head ache
      // @ts-ignore: next line
      const index = parseInt(sigRequest, 16) % keyGroup.unwrap().length
      // omg polkadot type gen is a head ache
      // @ts-ignore: next line
      return keyGroup.unwrap()[index]
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

  /**
   * Verifies and consolidates signatures received from validators.
   *
   * @param sigsAndProofs - Arrays of signatures and proofs.
   * @returns The first valid signature after verification.
   */

  async verifyAndReduceSignatures (sigsAndProofs: string[][]): Promise<string> {
    const seperatedSigsAndProofs = sigsAndProofs.reduce(
      (a, sp) => {
        if (!sp || !sp.length) return a
        // the place holder is for holding an index. in the future we should notify
        // the nodes or something about faulty validators
        // this is really just good house keeping because you never know?
        a.sigs.push(sp[0] || 'place-holder')
        a.proofs.push(sp[1] || 'place-holder')
        a.addresses.push(sp[2] || 'place-holder')
        return a
      },
      { sigs: [], proofs: [], addresses: [] }
    )
    // find a valid signature
    const sigMatch = seperatedSigsAndProofs.sigs.find(
      (s) => s !== 'place-holder'
    )
    if (!sigMatch) throw new Error('Did not receive a valid signature')
    // use valid signature to see if they all match
    const allSigsMatch = seperatedSigsAndProofs.sigs.every(
      (s) => s === sigMatch
    )
    if (!allSigsMatch) throw new Error('All signatures do not match')
    // in the future. notify network of compromise?
    // check to see if the tss_account signed the proof
    const validated = await Promise.all(
      seperatedSigsAndProofs.proofs.map(
        async (proof: string, index: number): Promise<boolean> => {
          return await this.crypto.verifySignature(
            seperatedSigsAndProofs.sigs[index],
            proof,
            seperatedSigsAndProofs.addresses[index]
          )
        }
      )
    )
    const first = validated.findIndex((v) => v)
    if (first === -1)
      throw new Error('Can not validate the identity of any validator')

    return seperatedSigsAndProofs.sigs[first]
  }
}
