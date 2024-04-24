import Entropy, { getWallet } from '../dist/index.js'

try {
  const seed =
    '98fb1f513a1d979aab3e77e4cb447fc7b0d724924314af4fb8f12e0140adc584'
  const signer = await getWallet(seed).catch((err) =>
    console.error('getWallet failed', err)
  )

  const entropyAccount = {
    sigRequestKey: signer,
    programModKey: signer,
  }

  const entropy = new Entropy({ account: entropyAccount })
  await entropy.ready

  console.log('DONE')
} catch (err) {
  console.log(err)
}
