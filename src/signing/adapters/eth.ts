import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { Transaction } from 'ethereumjs-tx'
import { encode } from 'rlp'
import { stripHexPrefix } from '../../utils'


export interface EthSignature {
  r: string
  s: string
  v: '0x1c' | '0x1b'
}

export async function preSign (txParams): Promise<string> {
  // nonce, gasprice, startgas, to, value, data, chainId, 0, 0
  const { nonce, gasprice, startGas, gasLimit, to, value, data, chainId } = txParams
  const tx = [
    stripHexPrefix(chainId),
    stripHexPrefix(nonce),
    stripHexPrefix(gasprice),
    stripHexPrefix(gasLimit) || stripHexPrefix(startGas),
    stripHexPrefix(to),
    stripHexPrefix(value),
    stripHexPrefix(data),
  ]
  return encode(tx).toString('hex')
}

export async function postSign (sig: Uint8Array, txParams): Promise<string> {
  const buffSig = Buffer.from(sig)
  console.log('buffsig:', buffSig.toString('hex'))
  const vrs = extractRSV(buffSig, parseInt(txParams.chainId))
  const tx = new Transaction({...txParams, ...vrs}, {chain: txParams.chainId})
  console.log('tx', tx.toJSON())
  return `0x${tx.serialize().toString('hex')}`
}

export const type = 'eth'
export const arch = Arch.Evm
export const hash = 'keccak'

export function pubToAddress (publicKey: string) {
  const hash = keccak256(Buffer.from(publicKey, 'hex'))
  return `0x${hash.slice(-20)}`
}

export function extractRSV (sig: Buffer, chainId): EthSignature {
  const r = `0x${sig.slice(0, 32).toString('hex')}`
  const s = `0x${sig.slice(32, 64).toString('hex')}`
  let v
  console.log('last bit', sig.readUInt8(64))
  if (sig.readUInt8(64)) {
    if (chainId === 1 || chainId === 61) {
      v = '0x1c'
    } else {
      v = `0x${(chainId * 2 + 36).toString(16)}`
    }
  } else {
    if (chainId === 1 || chainId === 61) {
      v = '0x1b'
    } else {
      v = `0x${(chainId * 2 + 35).toString(16)}`
    }
  }
  console.log('v value', v, sig.readUInt8(64))
  return { v, r, s }
}
