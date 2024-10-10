import { ApiPromise } from '@polkadot/api'
import { hexAddPrefix } from '@polkadot/util'
import { Signer } from '../keys/types/internal'
import { defaultAdapters } from './adapters/default'
import { Adapter } from './adapters/types'
import { ValidatorInfo } from '../types/internal'
import { stripHexPrefix, sendHttpPost, toHex } from '../utils'
import { crypto } from '../utils/crypto'
import { CryptoLib } from '../utils/crypto/types'
import Keyring from '../keys'

/**
 * Represents an encrypted message for transaction requests.
 */
export interface EncMsg {
  msg: string
  url: string
  tss_account: string
  // signature_verifying_key: number[]
}


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
    // @ts-ignore: next line
    const validators: string[] = (await this.substrate.query.session.validators()).toHuman()
    // @ts-ignore: next line
    const signingGroup: string[] = (await this.substrate.query.stakingExtension.signers()).toHuman()
    const validatorInfo: ValidatorInfo = await this.pickValidator(validators, signingGroup)
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
      validator: validatorInfo,
      hash,
      signatureVerifyingKey,
    }

    const message: EncMsg = await this.formatTxRequest(txRequest)
    const sigs = await this.submitTransactionRequest(message)
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

  async formatTxRequest ({
    strippedsigRequestHash,
    auxiliaryData,
    validator,
    hash,
    signatureVerifyingKey,
  }: {
    strippedsigRequestHash: string
    auxiliaryData?: unknown[]
    validator: ValidatorInfo
    hash?: string
    signatureVerifyingKey: string
  }): Promise<EncMsg> {
    console.log('validator', validator)
    const txRequestData: UserSignatureRequest = {
      message: stripHexPrefix(strippedsigRequestHash),
      auxilary_data: auxiliaryData,
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

    const encoded = Uint8Array.from(
      JSON.stringify(txRequestData),
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
  }

  /**
   * Sends transaction requests and retrieves the associated signatures.
   *
   * @param {EncMsg[]} txReq - An array of encrypted messages to send as transaction requests.
   * @returns {Promise<string[][]>} A promise that resolves to an array of arrays of signatures in string format.
   */

  async submitTransactionRequest (message: EncMsg): Promise<string[][]> {
    // Extract the required fields from parsedMsg
    const payload = JSON.parse(message.msg)
    console.log('EncMsg', message)
    console.log('payload', payload)
    const sigProof = (await sendHttpPost(
      `http://${message.url}/user/relay_tx`,
      JSON.stringify(payload)
    ))
    console.log('fetch returned:',sigProof, new Date(Date.now()))
    return sigProof
  }

  /**
   * Selects validators based on the signature request.
   *
   * @param {string} sigRequest - The signature request hash.
   * @returns {Promise<ValidatorInfo[]>} A promise resolving to an array of validator information.
   */

  async pickValidator (validators: string[], signingGroup: string[]): Promise<ValidatorInfo> {
    const relayers = validators.reduce((agg, stashKey) => {
      if (signingGroup.includes(stashKey)) return agg
      agg.push(stashKey)
      return agg
    }, [])
    const info = await Promise.all(validators.map(async (stashKey) => {
      const i = (await this.substrate.query.stakingExtension.thresholdServers(stashKey)).toHuman()
      // @ts-ignore
      return {...i, stashKey, relayer: relayers.includes(stashKey)}
    }))
    console.log('validators', validators, info)
    console.log('signingGroup', signingGroup)
    console.log('relayers', relayers)
    // pick a relayer at random
    const stashKey = relayers[Math.floor(Math.random() * relayers.length)]
    const rawValidatorInfo = (await this.substrate.query.stakingExtension.thresholdServers(stashKey)).toHuman()
    console.log('rawValidatorInfo', rawValidatorInfo)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { x25519PublicKey, endpoint, tssAccount } = rawValidatorInfo
    return {
      x25519_public_key: x25519PublicKey,
      ip_address: endpoint,
      tss_account: tssAccount,
    }
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
