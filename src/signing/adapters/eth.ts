import { utils } from 'ethers'
import { Arch } from '../../types'
import { keccak256 } from 'ethereum-cryptography'
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

export function pubToAddress (): Promise<string> {

}