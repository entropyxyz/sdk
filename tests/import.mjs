import Entropy from '../dist/index.js'
import { getWallet } from '../dist/keys/index.js'

async function start () {
  const seed = '98fb1f513a1d979aab3e77e4cb447fc7b0d724924314af4fb8f12e0140adc584'
  const signer = await getWallet(seed)

  const entropyAccount = {
    sigRequestKey: signer,
    programModKey: signer
  }

  const entropy = new Entropy({ account: entropyAccount })
  await entropy.ready

  console.log('DONE')
}

start()
