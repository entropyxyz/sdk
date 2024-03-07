import { Arch } from '../../types'
import { keccak256 } from "ethereum-cryptography/keccak.js"
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Common } from '@ethereumjs/common'
import { encode } from 'rlp'
import { stripHexPrefix } from '../../utils'
import { ethers } from "ethers";


export interface EthSignature {
  r: string
  s: string
  v: '0x1c' | '0x1b'
}

export async function preSign (txParams): Promise<string> {
    const common = Common.custom({ chainId: txParams.chainId }, { hardfork: txParams.hardfork || 'spuriousDragon' });
  // nonce, gasprice, startgas, to, value, data, chainId, 0, 0
  // const { nonce, gasprice, startGas, gasLimit, to, value, data, chainId } = txParams
  // const tx = [
  //   stripHexPrefix(nonce),
  //   stripHexPrefix(gasprice),
  //   stripHexPrefix(gasLimit) || stripHexPrefix(startGas),
  //   stripHexPrefix(to),
  //   stripHexPrefix(value),
  //   stripHexPrefix(data),
  //   stripHexPrefix(chainId),
  //   0,
  //   0
  // ]
  // return encode(tx).toString('hex')
  return '0x' + Buffer.from(FeeMarketEIP1559Transaction.fromTxData(txParams, { common }).serialize()).toString('hex')
}

export async function postSign (sig: Uint8Array, txParams): Promise<string> {
  const common = Common.custom({ chainId: txParams.chainId }, { hardfork: txParams.hardfork || 'spuriousDragon' });
  const buffSig = Buffer.from(sig)
  console.log('buffsig:', buffSig.toString('hex'))
  const vrs = extractRSV(buffSig, parseInt(txParams.chainId))
  return '0x' + Buffer.from(FeeMarketEIP1559Transaction.fromTxData({txParams, ...vrs}, { common }).serialize()).toString('hex')
}

export const type = 'eth'
export const arch = Arch.Evm
export const hash = 'keccak'

export function pubToAddress (publicKey: string) {
  return ethers.utils.computeAddress(publicKey)
}

export function extractRSV (sig: Buffer, chainId): EthSignature {
  const r = `0x${sig.slice(0, 32).toString('hex')}`
  const s = `0x${sig.slice(32, 64).toString('hex')}`
  const v = sig.readUInt8(64)

  console.log('last bit', sig.readUInt8(64), sig.slice(0, 32).toString('hex'))
  return { v, r, s }
}
