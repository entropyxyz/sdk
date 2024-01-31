import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { Transaction } from 'ethereumjs-tx'

export async function preSign (txData): Promise<string> {
  const tx = new Transaction(txData)
  const serializedTx = `0x${tx.serialize().toString('hex')}`
  return Buffer.from(serializedTx, 'utf8').toString('hex')
}

export async function postSign (sig: Uint8Array): Promise<string> {
  return Buffer.from(sig).toString('hex')
}

export const type = 'eth'
export const arch = Arch.Evm
export const hash = 'keccak'

export function pubToAddress (publicKey: string) {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}