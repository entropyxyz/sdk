import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { encode } from '@ethereumjs/rlp'
import { Transaction } from 'ethereumjs-tx'

export async function preSign (txData) {
  const tx = new Transaction(txData)

  const rlpEncodedTx = encode([
    tx.nonce,
    tx.gasPrice,
    tx.gasLimit,
    tx.to,
    tx.value,
    tx.data,
    tx.v,
    tx.r,
    tx.s
  ])

  return '0x' + (rlpEncodedTx as Buffer).toString('hex')
}

export async function postSign (sig: Uint8Array): Promise<string> {
  const hexTx = Buffer.from(sig).toString('hex')
  return hexTx
}

export const type = 'eth'
export const arch = Arch.Evm

export function pubToAddress (publicKey: string) {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}