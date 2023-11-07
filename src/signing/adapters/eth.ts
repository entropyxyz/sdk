import { utils } from 'ethers'
import { Arch } from '../../types'

export async function preSign (tx): Promise<string> {
  const serializedTx = await utils.serializeTransaction(tx)
  const sigHash = utils.keccak256(serializedTx)
  return sigHash
}

// noop
export async function postSign (sig: Uint8Array): Promise<string> {
  const hexTx = Buffer.from(sig).toString('hex')
  return hexTx
}

export const type = 'eth'
export const arch = Arch.Evm
