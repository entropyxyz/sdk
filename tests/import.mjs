import { readFileSync } from 'fs'
// TODO: fix the "dist" thing
import Entropy from '../dist/index.js'
import { getWallet } from '../dist/keys/index.js';

// import { charlieSeed } from './testing-utils/constants.ts'
const charlieSeed = '0xbc1ede780f784bb6991a585e4f6e61522c14e1cae6ad0895fb57b9a205a8f938'

try {
  const signer = await getWallet(charlieSeed);

  const entropyAccount = {
    sigRequestKey: signer,
    programModKey: signer,
    programDeployKey: signer,
  }

  const entropy = new Entropy({
    account: entropyAccount,
    endpoint: 'ws://54.175.228.156:9944'
  })
  await entropy.ready

  const programPath = new URL(
    './testing-utils/template_basic_transaction.wasm',
    import.meta.url
  )
  const basicTxProgram = readFileSync(programPath)

  // NOTE: dev.deploy is a confusing name => entropy.programs.deploy
  const programPointer = await entropy.programs.dev.deploy(basicTxProgram)
    .catch(err => {
      console.log('ERROR', err)
    })



  console.log(programPointer)

  console.log('DONE')
} catch (err) {
  console.log(err)
}
