import { utils } from 'ethers'





export async function preSign (tx): Promise<string> {
  const serializedTx = await utils.serializeTransaction(tx)
  const sigHash = utils.keccak256(serializedTx)

}

export async function postSign (): {

}

export const type = 'eth'
export const arch = type