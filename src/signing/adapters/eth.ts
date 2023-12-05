import { utils } from 'ethers'
import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"

export async function preSign (tx): Promise<string> {
  // rlp encode
  return await utils.serializeTransaction(tx)
}

export async function postSign (sig: Uint8Array): Promise<string> {
  const hexTx = Buffer.from(sig).toString('hex')
  return hexTx
}

export const type = 'eth'
export const arch = Arch.Evm

export function pubToAddress (publicKey: string): Promise<string> {
  return new Promise(resolve => {
    if (publicKey.startsWith('0x')) {
      publicKey = publicKey.slice(2)
    }
    const hash = keccak256(Buffer.from(publicKey, 'hex'))
    resolve('0x' + hash.slice(-40))
  })
}