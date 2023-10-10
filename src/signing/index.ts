

// import { ApiPromise } from '@polkadot/api'
// import ExtrinsicBaseClass from '../extrinsic'
// import { Signer } from '../types'
// import { SignatureLike } from '@ethersproject/bytes'
// import { defaultAdapters } from './adapters/default'
// import { Adapter } from './adapters/types'
// import { Arch, EncMsg, ValidatorInfo } from '../types'
// import { stripHexPrefix, sendHttpPost, sleep } from '../utils'
// import { crypto, CryptoLib } from '../utils/crypto'
// import { serializeTransaction } from 'ethers/lib/utils'
// import { hexToBase64,hexToBase64remove, u8ArrayToString, hexStringToIntArray } from '../utils'
// import { hexToU8a, isHex } from '@polkadot/util'
// import { BigNumber } from 'ethers'


// export interface Config {
//   signer: Signer
//   substrate: ApiPromise
//   adapters: { [key: string | number]: Adapter }
//   crypto: CryptoLib
// }

// export interface TxParams {
//   [key: string]: any
// }

// export interface SigTxOps {
//   txParams: TxParams
//   type?: string
//   freeTx?: boolean
//   retries?: number
// }

// export interface SigOps {
//   sigRequestHash: string
//   arch?: Arch
//   type?: string
//   freeTx?: boolean
//   retries?: number
// }

// export default class SignatureRequestManager extends ExtrinsicBaseClass {
//   adapters: { [key: string | number]: Adapter }
//   signer: Signer
//   crypto: CryptoLib

//   constructor ({ signer, substrate, adapters, crypto }: Config) {
//     super({ signer, substrate })
//     this.crypto = crypto
//     this.adapters = {
//       ...defaultAdapters,
//       ...adapters,
//     }
//   }

//   async signTransaction ({
//     txParams,
//     type,
//     freeTx = true,
//     retries,
//   }: SigTxOps): Promise<SignatureLike> {
//     if (!this.adapters[type])
//       throw new Error(`No transaction adapter for type: ${type} submit as hash`)
//     if (!this.adapters[type].preSign)
//       throw new Error(
//         `Adapter for type: ${type} has no preSign function. Adapters must have a preSign function`
//       )

//     const sigRequestHash = await this.adapters[type].preSign(txParams)
//     const signature = await this.sign({
//       sigRequestHash,
//       type,
//       arch: this.adapters[type].arch,
//       freeTx,
//       retries,
//     })
//     if (this.adapters[type].postSign) {
//       return await this.adapters[type].postSign(signature)
//     }

//     return signature
//   }

//   async sign ({
//     sigRequestHash,
//     arch,
//     freeTx = true,
//     retries,
//   }: SigOps): Promise<SignatureLike> {
//     const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(
//       sigRequestHash
//     )

//     const txRequests: Array<EncMsg> = await this.formatTxRequests({validatorsInfo, sigRequestHash})
//     const sigs = await this.submitTransactionRequest(txRequests)
//     const sig = sigs[0]
//     console.log('Signature: ', sig)
//     return sig
//   }

//   getTimeStamp () {
//     const timestampInMilliseconds = Date.now()
//     const secs_since_epoch = Math.floor(timestampInMilliseconds / 1000)
//     const nanos_since_epoch = (timestampInMilliseconds % 1000) * 1_000_000

//     return {
//       secs_since_epoch: secs_since_epoch,
//       nanos_since_epoch: nanos_since_epoch,
//     }
//   }

//   async formatTxRequests ({ sigRequestHash, validatorsInfo }: { sigRequestHash: string, validatorsInfo: Array<ValidatorInfo> }): Promise<EncMsg[]> {
//     return await Promise.all(
//       validatorsInfo.map(
//         async (validator: ValidatorInfo): Promise<EncMsg> => {
//           const txRequestData = {
//             transaction_request: stripHexPrefix(sigRequestHash),
//             validators_info: validatorsInfo,
//             timestamp: this.getTimeStamp()
//           }

//           const serverDHKey = await crypto.from_hex(validator.x25519_public_key)

//           const formattedValidators = await Promise.all(validatorsInfo.map(async (v) => {
//             return { ...v, x25519_public_key: Array.from(await crypto.from_hex(v.x25519_public_key)) }
//           }))

//           const encoded = Uint8Array.from(
//             JSON.stringify({ ...txRequestData, validators_info: formattedValidators}),
//             (x) => x.charCodeAt(0)
//           )
//           console.log("TXREQUEST", JSON.stringify({ ...txRequestData, validators_info: formattedValidators}))


//           const encryptedMessage = JSON.parse(await crypto.encrypt_and_sign(
//             this.signer.pair.secretKey,
//             encoded,
//             serverDHKey
//           ))

//           const formatedMsg = {
//             ...encryptedMessage,
//             msg: stripHexPrefix(encryptedMessage.msg),
//           }

//           return {
//             url: validator.ip_address,
//             msg: JSON.stringify(formatedMsg),
//           }
//         }
//       )
//     )
//   }

//   async createTestSignCurlsForSign ({
//     sigRequestHash,
//     arch,
//     freeTx = true,
//     retries,
//   }: SigOps): Promise<void> {
//     const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(
//       sigRequestHash
//     )

//     const txRequests: Array<EncMsg> = await this.formatTxRequests({validatorsInfo, sigRequestHash})

//     const v1 = txRequests[0]
//     const v2 = txRequests[1]

//     console.log(`\x1b[33m
//     curl -X POST -H "Content-Type: application/json" \\
//     -d '${v1.msg}' \\
//     -H "Accept: application/json" \\
//     ${`http://${v1.url}/user/sign_tx`} > v1.txt &
//     curl -X POST -H "Content-Type: application/json" \\
//     -d '${v2.msg}' \\
//     -H "Accept: application/json" \\
//     ${`http://${v2.url}/user/sign_tx`} > v2.txt
//     \x1b[0m`)

//   }

//   async submitTransactionRequest (txReq: Array<EncMsg>): Promise<SignatureLike[]> {
//     return Promise.all(txReq.map(async (message: EncMsg) => {
//       const response = await sendHttpPost(
//         `http://${message.url}/user/sign_tx`,
//         JSON.stringify(message.msg)
//       )

//       const reader = response.body.getReader()
//       const start = (controller) => {
//         async function pump () {
//           const { done, value } = await reader.read()
//           if (done) {
//             controller.close()
//             return
//           }
//           controller.enqueue(value)
//           return pump()
//         }
//         return pump()
//       }
//       const stream = new ReadableStream({ start })
//       const streamResponse = new Response(await stream)
//       if (!streamResponse.ok) {
//         throw new Error(`request failed ${streamResponse.status}, ${streamResponse.statusText} FULLRESPONSE: ${await streamResponse.text()}`)
//       }

//       const sig = await streamResponse.text()
//       console.log(`\x1b[33m
//           this is the response:
//           ${sig}
//       \x1b[0m`)

//       return sig
//     }))
//   }


//   async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
//     const stashKeys = (
//       await this.substrate.query.stakingExtension.signingGroups.entries()
//     ).map(
//       ([{ args: [group] }, stashKeys]) => {
//         const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
//         return stashKeys.unwrap()[index]
//       }
//     )

//     const rawValidatorInfo = await Promise.all(
//       stashKeys.map((stashKey) =>
//         this.substrate.query.stakingExtension.thresholdServers(stashKey)
//       )
//     )


//     const validatorsInfo: Array<ValidatorInfo> = rawValidatorInfo.map(
//       (validator) => {
//         /*
//         fuck me, i'm sorry frankie i know this looks bad and you're right
//         it does but this is going to require a destruction of polkadotjs as a dependency
//         or parsing the return types are selves? but if we do that we might as well not use polkadot js
//       */
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-ignore
//         const { x25519PublicKey, endpoint, tssAccount } = validator.toHuman()
//         //test 

//         return {
//           x25519_public_key: x25519PublicKey,
//           ip_address: endpoint,
//           tss_account: tssAccount,
//         }
//       }
//     )

//     return validatorsInfo
//   }

//   // async pollNodeForSignature (
//   //   sigHash: string,
//   //   thresholdUrl: string,
//   //   retries: number
//   // ): Promise<SignatureLike> {
//   //   let i = 0
//   //   let status
//   //   let postRequest


//   //   while (status !== 202 && i < retries) {
//   //     try {
//   //       postRequest = await fetch(`http://${thresholdUrl}/sign/sign_tx`, {
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //         method: 'POST',
//   //         body: JSON.stringify({ message: sigHash }),
//   //       })
//   //       status = postRequest.status
//   //     } catch (e) {
//   //       status = 500
//   //       console.error(e)
//   //     }
//   //     await sleep(3000)
//   //     i++
//   //   }
//   //   const result = await postRequest.text()
//   //   if (!postRequest.ok) {
//   //     console.error('Server responded with:', result)
//   //     throw new Error(await result)
//   //   }

//   //   try {
//   //     return Uint8Array.from(atob(result), (c) => c.charCodeAt(0))
//   //   } catch (e) {
//   //     throw new Error(postRequest.statusText)
//   //   }
//   // }
// }




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
import { hexToBase64,hexToBase64remove, u8ArrayToString, hexStringToIntArray } from '../utils'
import { hexToU8a, isHex } from '@polkadot/util'
import { BigNumber } from 'ethers'


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
  crypto: CryptoLib

  constructor ({ signer, substrate, adapters, crypto }: Config) {
    super({ signer, substrate })
    this.crypto = crypto
    this.adapters = {
      ...defaultAdapters,
      ...adapters,
    }
  }

  async signTransaction ({
    txParams,
    type,
    freeTx = true,
    retries,
  }: SigTxOps): Promise<SignatureLike> {
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
      arch: this.adapters[type].arch,
      freeTx,
      retries,
    })
    if (this.adapters[type].postSign) {
      return await this.adapters[type].postSign(signature)
    }

    return signature
  }

  async sign ({
    sigRequestHash,
    arch,
    freeTx = true,
    retries,
  }: SigOps): Promise<SignatureLike> {
    const strippedsigRequestHash = stripHexPrefix(sigRequestHash)
    const validatorsInfo: Array<ValidatorInfo> = await this.getArbitraryValidators(
      strippedsigRequestHash
    )

    console.log("SIG!!!", strippedsigRequestHash)

    const txRequests: Array<EncMsg> = await this.formatTxRequests({validatorsInfo, strippedsigRequestHash})
    const sigs = await this.submitTransactionRequest(txRequests)
    const sig = sigs[0]
    console.log('Signature: ', sig)
    return sig
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

  async formatTxRequests ({ strippedsigRequestHash, validatorsInfo }: { strippedsigRequestHash: string, validatorsInfo: Array<ValidatorInfo> }): Promise<EncMsg[]> {
    return await Promise.all(
      validatorsInfo.map(
        async (validator: ValidatorInfo): Promise<EncMsg> => {
          const txRequestData = {
            transaction_request: stripHexPrefix(strippedsigRequestHash),
            validators_info: validatorsInfo,
            timestamp: this.getTimeStamp()
          }

          const serverDHKey = await crypto.from_hex(validator.x25519_public_key)

          const formattedValidators = await Promise.all(validatorsInfo.map(async (v) => {
            return { ...v, x25519_public_key: Array.from(await crypto.from_hex(v.x25519_public_key)) }
          }))

          const encoded = Uint8Array.from(
            JSON.stringify({ ...txRequestData, validators_info: formattedValidators}),
            (x) => x.charCodeAt(0)
          )
          console.log("TXREQUEST", JSON.stringify({ ...txRequestData, validators_info: formattedValidators}))


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

  async submitTransactionRequest (txReq: Array<EncMsg>): Promise<SignatureLike[]> {
    return Promise.all(txReq.map(async (message: EncMsg) => {
      let parsedMsg
      try {
        parsedMsg = JSON.parse(message.msg)
      } catch (error) {
        throw new Error('Failed to parse encMsg as JSON:' + error.message)
      }

      const payload = {
        ...parsedMsg,
        msg: stripHexPrefix(parsedMsg.msg),
      }

      const response = await sendHttpPost(
        `http://${message.url}/user/sign_tx`,
        JSON.stringify(payload)
      )

      const reader = response.body.getReader()
      const start = (controller) => {
        async function pump () {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            return
          }
          controller.enqueue(value)
          return pump()
        }
        return pump()
      }
      const stream = new ReadableStream({ start })
      const streamResponse = new Response(await stream)
      if (!streamResponse.ok) {
        throw new Error(`request failed ${streamResponse.status}, ${streamResponse.statusText} FULLRESPONSE: ${await streamResponse.text()}`)
      }

      const sig = await streamResponse.text()
      console.log(`\x1b[33m
          this is the response:
          ${sig}
      \x1b[0m`)

      return sig
    }))
  }


  async getArbitraryValidators (sigRequest: string): Promise<ValidatorInfo[]> {
    const stashKeys = (
      await this.substrate.query.stakingExtension.signingGroups.entries()
    ).map(
      ([{ args: [group] }, stashKeys]) => {
        const index = parseInt(sigRequest, 16) % stashKeys.unwrap().length
        return stashKeys.unwrap()[0]
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
        //test 

        return {
          x25519_public_key: x25519PublicKey,
          ip_address: endpoint,
          tss_account: tssAccount,
        }
      }
    )

    console.log("VALIDATORS", [validatorsInfo])
    return validatorsInfo
  }


}
