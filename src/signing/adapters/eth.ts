import { keccak256 } from 'ethereum-cryptography/keccak.js'
import { Transaction } from 'ethereumjs-tx'

export interface EthSignature {
  r: string
  s: string
  v: '0x1c' | '0x1b'
}

export async function preSign(txParams): Promise<string> {
  const tx = new Transaction(txParams)
  const serializedTx = `0x${tx.serialize().toString('hex')}`
  return Buffer.from(serializedTx, 'utf8').toString('hex')
}

export async function postSign(sig: Uint8Array, txParams): Promise<string> {
  const buffSig = Buffer.from(sig)
  const rsv = extractRSV(buffSig)
  const tx = new Transaction({ ...txParams, ...rsv })
  return `0x${tx.serialize().toString('hex')}`
}

export const type = 'eth'
export const hash = 'keccak'

export function pubToAddress(publicKey: string) {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}

export function extractRSV(sig: Buffer): EthSignature {
  const r = `0x${sig.slice(0, 32).toString('hex')}`
  const s = `0x${sig.slice(32, 64).toString('hex')}`
  const v = sig.readUInt8(64) ? '0x1c' : '0x1b'

  return { r, s, v }
}
