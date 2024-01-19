import ExtrinsicBaseClass from '../extrinsic'
import { ApiPromise } from '@polkadot/api'
import { Signer } from '../types'
import { SubmittableExtrinsic } from '@polkadot/api/types'
import { hex2buf } from '../utils'
import * as util from '@polkadot/util'


export default class ProgramDev extends ExtrinsicBaseClass {
  constructor ({
    substrate,
    signer
  }: {
    substrate: ApiPromise
    signer: Signer
  }) {
    super({ substrate, signer })
  }
}