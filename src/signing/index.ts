import { ApiPromise } from '@polkadot/api'
import { hexAddPrefix } from '@polkadot/util'
import { Signer } from '../keys/types/internal'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { EncMsg, ValidatorInfo } from '../types/internal'
import { stripHexPrefix, sendHttpPost, toHex } from '../utils'
import { crypto } from '../utils/crypto'
import { CryptoLib } from '../utils/crypto/types'
import Keyring from '../keys'

export interface Config {
  keyring: Keyring
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

export interface SigWithAdaptersOps extends SigMsgOps {
  order: string[]
  signatureVerifyingKey?: string
}

export interface SigOps {
  sigRequestHash: string
  hash: string
  type?: string
  auxiliaryData?: unknown[]
  signatureVerifyingKey?: string
}

/**
 * A class to manage the creation, signing, and verification of signature requests.
 */
export interface UserSignatureRequest {
  message: string
  // Any type for now i assume?
  auxilary_data?: any
  validatorsInfo: ValidatorInfo[]
  block_number: number
  hash: string
  signature_verifying_key: number[]
}

/**
 * Constructs a SignatureRequestManager instance.
 *
 * @param {Config} config - The configuration for the SignatureRequestManager.
 * @param {Keyring} config.keyring - The full keyring
 * @param {Signer} config.signer - The Signer instance.
 * @param {ApiPromise} config.substrate - The Substrate API instance.
 * @param {Adapter} config.adapters - The adapters for handling different types of transactions.
 * @param {CryptoLib} config.crypto - The cryptographic library.
 */

export default class SignatureRequestManager {
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib
  keyring: Keyring
  signer: Signer
  substrate: ApiPromise
  #keyGroups?: {[key: string | number]: any}
  /**
   * Initializes a new instance of `SignatureRequestManager`.
   *
   * @param {Config} config - Configuration settings for the manager.
   * @param {Keyring} config.keyring - The full keyring
   * @param {Signer} config.signer - The signer for authorizing transactions.
   * @param {ApiPromise} config.substrate - Instance of the Polkadot/Substrate API.
   * @param {Adapter[]} config.adapters - Set of adapters for handling different types of transactions.
   * @param {CryptoLib} config.crypto - Instance of CryptoLib for cryptographic operations.
   */

  constructor ({ keyring, signer, substrate, adapters, crypto }: Config) {
    this.keyring = keyring
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
    let key = this.signer?.verifyingKeys?.[0]
    // Returning verifying key from regsitration account if device key keys do not exist
    if (!key) {
      key = this.keyring.accounts.registration.verifyingKeys[this.keyring.accounts.registration.verifyingKeys.length - 1]
    }
    return key
  }

  /**
            DO NOT DELET THIS CODE BLOCK!

    Signs a message using the appropriate adapter.

    @param {SigWithAdaptersOps} sigWithAdaptersOps - Parameters for the signature operation
    @param {MsgParams} sigWithAdaptersOps.msg - object containing the msg hex string to be sign, in the shape of { msg: string }
    @param {string[]} sigWithAdaptersOps.order - array containing the names of adapters in the expected order ['deviceKeyProxy', 'noop']
    @param {string} sigWithAdaptersOps.signatureVerifyingKey - verifying key that can be supplied by the user to overwrite the verifying key used from the keyring
    @returns {Promise<unknown>} A promise resolving with the signature.
    @throws {Error} If no adapter or preSign function is found for the given type.
   */

  async signWithAdaptersInOrder ({
    msg,
    order,
    signatureVerifyingKey
  }: SigWithAdaptersOps): Promise<unknown> {
    if (!order) {
      throw new Error(
        `must provide order: expecting a string[] of adapter types got: ${order}`
      )
    }

    const adaptersToRun = order.reduce((agg, name) => {
      const adapter = this.adapters[name]
      if (!adapter) {
        throw new Error(`no adapter for type: ${name} in your order: ${order}`)
      } else if (!adapter.preSign) {
        throw new Error(
          `Adapter for type: ${name} has no preSign function. Adapters must have a preSign function`
        )
      } else {
        agg.push(adapter)
      }
      return agg
    }, [])
    // this is the named keys we care about from post sign. { sigRequestHash, auxilary_data }
    const results = await Promise.all(
      adaptersToRun.map((adapter) => {
        return adapter.preSign(this.signer, msg)
      })
    )

    // [AuxData[], ...]
    const auxiliaryDataCollection = results.map(({ auxilary_data }) => {
      return auxilary_data
    })
    // flatten
    const auxiliaryData = [].concat(...auxiliaryDataCollection)
    // grab the first sigRequestHash
    const { sigRequestHash } = results[0]
    const signature = await this.sign({
      sigRequestHash,
      hash: adaptersToRun[0].HASHING_ALGORITHM,
      auxiliaryData,
      signatureVerifyingKey,
    })
    return signature
  }

  /**
   * Signs a given signature request hash.
   *
   * @param {SigOps} sigOps - Parameters for the signature operation.
   * @param {string} sigOps.sigRequestHash - The hash of the signature request to be signed.
   * @param {string} sigOps.hash - The name of the hashing algorithm used to hash the signature.
   * @param {unknown[]} sigOps.auxilaryData - Additional data for the signature operation.
   * @param {signatureVerifyingKey} sigOps.signatureVerifyingKey - The verifying key for the signature requested
   * @returns {Promise<Uint8Array>} A promise resolving to the signed hash as a Uint8Array.
   */

  async sign ({
    sigRequestHash,
    hash,
    auxiliaryData,
    signatureVerifyingKey: signatureVerifyingKeyOverwrite,
  }: SigOps): Promise<Uint8Array> {
    const strippedsigRequestHash = stripHexPrefix(sigRequestHash)
    const validatorsInfo: Array<ValidatorInfo> = await this.pickValidators(
      strippedsigRequestHash
    )
    // TO-DO: this needs to be and accounId ie hex string of the address
    // which means you need a new key ie device key here

    // The need to overwrite the signature verifying key in certain cases is for when
    // the program being used to sign a message may require a different verifying key than
    // that is generated by the keyring. An example of this is available in the faucet flow within
    // Entropy CLI.
    const signatureVerifyingKey = signatureVerifyingKeyOverwrite || this.verifyingKey

    const txRequest = {
      strippedsigRequestHash,
      auxiliaryData,
      validatorsInfo: validatorsInfo,
      hash,
      signatureVerifyingKey,
    }

    const txRequests: Array<EncMsg> = await this.formatTxRequests(txRequest)
    // this is because of a bug we are seeing in signing groups see
    // issue on entropy-core #890
    // https://github.com/entropyxyz/entropy-core/issues/890
    // https://github.com/entropyxyz/sdk/issues/380
    let sigs
    try {
      sigs = await this.submitTransactionRequest(txRequests)
      // clear preserved keygroups if not failed
      this.#keyGroups = {}
    } catch (e) {
      // this is not a private function for tests?
      // if this fails really fail
      sigs = await this._shouldTryAgain(e, txRequest)
    }
    const sig = await this.verifyAndReduceSignatures(sigs)
    return Uint8Array.from(atob(sig), (c) => c.charCodeAt(0))
  }

  /**
   * Retrieves the current block number
   *
   * @returns
   */

  async getBlockNumber (): Promise<number> {
    const signedBlock = await this.substrate.rpc.chain.getBlock()
    // @ts-ignore
    return signedBlock.block.header.toJSON().number
  }

  /**
   * Generates transaction requests formatted for validators.
   *
   * @param {object} params - Parameters for generating the transaction request.
   * @param {string} params.strippedsigRequestHash - Stripped signature request hash.
   * @param {unknown[]} [params.auxiliaryData] - Additional data for the transaction request.
   * @param {ValidatorInfo[]} params.validatorsInfo - Information about the validators.
   * @param {string} [params.hash] - The hash type.
   * @param {signatureVerifyingKey[]} params.signatureVerifyingKey - The verifying key for the signature requested
   * @returns {Promise<EncMsg[]>} A promise that resolves to the formatted transaction requests.
   */

  async formatTxRequests ({
    strippedsigRequestHash,
    auxiliaryData,
    validatorsInfo,
    hash,
    signatureVerifyingKey,
  }: {
    strippedsigRequestHash: string
    auxiliaryData?: unknown[]
    validatorsInfo: Array<ValidatorInfo>
    hash?: string
    signatureVerifyingKey: string
  }): Promise<EncMsg[]> {
    return await Promise.all(
      validatorsInfo.map(async (validator: ValidatorInfo): Promise<EncMsg> => {
        const txRequestData: UserSignatureRequest = {
          message: stripHexPrefix(strippedsigRequestHash),
          auxilary_data: auxiliaryData,
          validatorsInfo: validatorsInfo,
          block_number: await this.getBlockNumber(),
          hash,
          signature_verifying_key: Array.from(
            Buffer.from(stripHexPrefix(signatureVerifyingKey), 'hex')
          ),
        }

        // TODO: auxilaryData full implementation
        if (auxiliaryData) {
          txRequestData.auxilary_data = auxiliaryData.map((singleAuxData) =>
            toHex(JSON.stringify(singleAuxData))
          )
        }
        // TODO handle array here

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

  async pickValidators (sigRequest: string, inReverse?: boolean): Promise<ValidatorInfo[]> {
    if (!this.#keyGroups) this.#keyGroups = {}

    const entries =
      await this.substrate.query.stakingExtension.signingGroups.entries()
    const stashKeys = entries.map((group, i) => {
      const keyGroup = group[1]
      // define keygroups see issue#380 https://github.com/entropyxyz/sdk/issues/380
      this.#keyGroups[i] = keyGroup
      // omg polkadot type gen is a head ache
      // 
      // If the Message being signed is too long the sigRequestHash is then converted to a number
      // so large that the resulting parsed value of parseInt(sigRequest, 16) would return Infinity.
      // Using BigInt instead solves the Infinity issue, and now allows messages of any length to be
      // signed.
      //
      let sigToConvert = sigRequest
      if (!hexHasPrefix(sigToConvert)) {
        sigToConvert = hexAddPrefix(sigRequest)
      }
      // @ts-ignore: next line
      const index = Number(BigInt(sigToConvert) % BigInt(keyGroup.unwrap().length))
      if (isNaN(index)) {
        throw new Error(`when calculating the index for choosing a validator got: NaN`)
      }
      this.#keyGroups.chosenIndex = index
      // omg polkadot type gen is a head ache
      // @ts-ignore: next line
      return inReverse ? this.#keyGroups[i].unwrap().reverse()[index] : keyGroup.unwrap()[index]
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

  async _shouldTryAgain (e, txRequest, alreadyTried?: boolean): Promise<any> {
    if(e.message.includes('Invalid Signer') && alreadyTried) {
      const message = [
        'Something went wrong in choosing a validator from a group:',
        `index: ${this.#keyGroups.chosenIndex}`,
        `sigRequest: ${txRequest.strippedsigRequestHash}`,
      ].join('\n')

      this.#keyGroups = {}
      throw new Error(message)
    } else if (e.message.includes('Invalid Signer')) {
      txRequest.validatorsInfo = await this.pickValidators(txRequest.strippedsigRequestHash, true)
      const txRequestTry2 = await this.formatTxRequests(txRequest)
      let sigs
      try {
        sigs = await this.submitTransactionRequest(txRequestTry2)
      } catch (error) {
        // just calling again to throw
        await this._shouldTryAgain(error, txRequest, true)
      }
      this.#keyGroups = {}
      return sigs
    }
    // allways throw if you dont satisfy
    throw e
  }
}
