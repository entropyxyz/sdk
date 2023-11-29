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
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
  signer: Signer
  substrate: ApiPromise

  /**
   * Initializes a new instance of `SignatureRequestManager`.
   *
   * @param signer - The signer for authorizing transactions.
   * @param substrate - Instance of the Polkadot/Substrate API.
   * @param adapters - Set of adapters for handling different types of transactions.
   * @param crypto - Instance of CryptoLib for cryptographic operations.
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
   * Signs a transaction using the appropriate adapter.
   *
   * @param txParams - The parameters of the transaction to be signed.
   * @param type - The type of transaction.
   * @returns A promise resolving with the signed transaction.
   * @throws Error if an adapter for the transaction type is not found.
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
   * Signs a given signature request hash.
   *
   * @param sigRequestHash - The hash of the signature request to be signed.
   * @returns A promise resolving to the signed hash as a Uint8Array.
   */

  async sign ({ sigRequestHash }: SigOps): Promise<Uint8Array> {
    const strippedsigRequestHash = stripHexPrefix(sigRequestHash)
    const validatorsInfo: Array<ValidatorInfo> = await this.pickValidators(
      strippedsigRequestHash
    )

    const txRequests: Array<EncMsg> = await this.formatTxRequests({
      validatorsInfo: validatorsInfo,
      strippedsigRequestHash,
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
   * @param strippedsigRequestHash - Stripped signature request hash.
   * @param validatorsInfo - Information about the validators.
   * @returns A promise resolving to an array of encrypted messages for validators.
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
            message: stripHexPrefix(strippedsigRequestHash),
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
            msg: encryptedMessage,
            url: validator.ip_address,
            tss_account: validator.tss_account,
          }
        }
      )
    )
  }

  /**
   * Sends transaction requests and retrieves the associated signatures.
   *
   * @param txReq - An array of encrypted messages to send as transaction requests.
   * @returns A promise that resolves to an array of arrays of signatures in string format.
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
        const sigProof = await sendHttpPost(
          `http://${message.url}/user/sign_tx`,
          JSON.stringify(payload)
        ) as string[]
        sigProof.push(message.tss_account)
        return sigProof
      })
    )
  }

  /**
   * Selects validators based on the signature request.
   *
   * @param sigRequest - The signature request hash.
   * @returns A promise resolving to an array of validator information.
   */

  async pickValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const entries = await this.substrate.query.stakingExtension.signingGroups.entries()
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
