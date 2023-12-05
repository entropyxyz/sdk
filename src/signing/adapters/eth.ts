import { utils } from 'ethers'
import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { stripHexPrefix } from '../../utils'
import { encode } from '@ethereumjs/rlp'
export async function preSign (tx): Promise<string> {
  // rlp encode
  return await encode(tx)
}

export async function postSign (sig: Uint8Array): Promise<string> {
  const hexTx = Buffer.from(sig).toString('hex')
  return hexTx
}

export const type = 'eth'
export const arch = Arch.Evm

export function pubToAddress (publicKey: string): Promise<string> {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}