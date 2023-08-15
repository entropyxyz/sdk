import { ApiPromise } from '@polkadot/api'
import { Extrinsic } from '../extrinsic'
import { Signer } from '../types'
import { SignatureLike } from '@ethersproject/bytes'
import { Arch, EncMsg } from '../types'
import { Adapter } from './adapters/types'
import { UserTransactionRequest } from '../types'

export interface Config {
    signer: Signer
    substrate: ApiPromise
    adapters: { [key: string | number]: Adapter }
}

export class SignatureRequestManager extends Extrinsic {
    adapters: { [key: string | number]: Adapter }

    constructor({ signer, substrate, adapters }: Config) {
        super({ signer, substrate })
        this.adapters = {
            ...defaultAdapters,  // Uncomment if you have this defined somewhere
            ...adapters
        }
    }

    async getArbitraryValidators(sigRequest: string) {
        const stashKeys = (await this.substrate.query.stakingExtension.signingGroups.entries())
            .map(group => {
                const index = parseInt(sigRequest, 16) % group.length
                return group[index]
            })

        return Promise.all(stashKeys.map(stashKey => this.substrate.query.stakingExtension.thresholdServers(stashKey)))
    }

    async sign({
        sigRequestHash,
        arch,
        freeTx = true,
        retries
    }: {
        sigRequestHash: string
        arch: Arch
        freeTx?: boolean
        retries?: number
    }): Promise<SignatureLike> {
        const validatorsInfo = await this.getArbitraryValidators(sigRequestHash)

        const txRequestData: UserTransactionRequest = {  // Ensure this type is imported/defined
            arch,
            transaction_request: sigRequestHash,
            validator_ips: validatorsInfo.map((validator) => validator.ipAddress), // double check polkadot
        }

        const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator, i) => {
            const serverDHKey = await this.crypto.parseServerDHKey({
                x25519PublicKey: validatorsInfo[i].x25519PublicKey,
            })

            const encoded = Uint8Array.from(
                JSON.stringify({ ...txRequestData }),
                (x) => x.charCodeAt(0)
            )

            const encryptedMessage = await this.crypto.encryptAndSign(
                this.signer.pair.secretKey,
                encoded,
                serverDHKey
            )

            return {
                url: validatorsInfo[i].ipAddress,
                encMsg: encryptedMessage,
            }
        }))

        // Assuming sigHash is derived from sigRequestHash or similar
        const sigHash = someFunctionToDeriveSigHash(sigRequestHash)  // Define this function

        const signature: SignatureLike = await this.thresholdServer.pollNodeForSignature(
            sigHash.slice(2),
            validatorsInfo[0].ipAddress,
            retries
        )

        return signature
    }
}

// we're getting rid of thresholdServer via fetch 
// 