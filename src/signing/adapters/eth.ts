import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { Transaction } from 'ethereumjs-tx'

export async function preSign (txData): Promise<string> {
  const tx = new Transaction(txData)
  const serializedTx = tx.serialize().toString('hex')
  return serializedTx
}

export async function postSign (sig: Uint8Array): Promise<string> {
  return Buffer.from(sig).toString('hex')
}

export const type = 'eth'
export const arch = Arch.Evm

export function pubToAddress (publicKey: string) {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}