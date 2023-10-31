import { ApiPromise } from '@polkadot/api'
import ExtrinsicBaseClass from '../extrinsic'
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

export default class SignatureRequestManager extends ExtrinsicBaseClass {
  adapters: { [key: string | number]: Adapter }
  crypto: CryptoLib

  constructor ({ signer, substrate, adapters, crypto }: Config) {
    super({ signer, substrate })
    this.crypto = crypto
    this.adapters = {
      ...defaultAdapters,
      ...adapters,
    }
  }

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

  getTimeStamp () {
    const timestampInMilliseconds = Date.now()
    const secs_since_epoch = Math.floor(timestampInMilliseconds / 1000)
    const nanos_since_epoch = (timestampInMilliseconds % 1000) * 1_000_000

    return {
      secs_since_epoch: secs_since_epoch,
      nanos_since_epoch: nanos_since_epoch,
    }
  }

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

  async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const stashKeys = (
      await this.substrate.query.stakingExtension.signingGroups.entries()
    ).map((group) => {
      const stashKeys = group[1]
      // omg polkadot type gen is a head ache
      // @ts-ignore: next line
      const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
      // omg polkadot type gen is a head ache
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
