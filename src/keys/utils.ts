import {
  sr25519PairFromSeed,
  cryptoWaitReady,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress
} from '@polkadot/util-crypto'

const ready = cryptoWaitReady()


// for the device key generate a random number example: `device-key:${uid}`
export function getPath ({type, uid}: {type: string, uid: UIDv4}): string {
  if (UIDv4regex.test(uid)) {
    return `//entropy//${type}///${UIDV4}`
  }
  throw new TypeError('uid is not correct type please provide the correct regex matching string')
}


export function generateMnemonic () {
  await ready
  return mnemonicGenerate()
}

export function generateSeed (): string {
  await ready
  const mnemonic = mnemonicGenerate()
  const mnemonicMini = mnemonicToMiniSecret(mnemonic)
}



/**
 * @param seed {@link string}
 * @param derivation {@link string}
 * @returns Signer {@link Signer}
 * generates A usable signer with meta info about the account i.e. address etc
 * */

export function generateKeyPairFromSeed (seed: string, dervation?: string): { address: string; privateKey: string, pair: Signer } {
  await ready
  let pair
  if (dervation) {
    const masterPair = sr25519PairFromSeed(seed)
    const { path } = keyExtractPath(dervation)
    pair = keyFromPath(masterPair, path, 'sr25519')
  } else {
    pair = sr25519PairFromSeed(seed)
  }

  return {
    // this might break address formatting? test against charlie stash address
    address: encodeAddress(pair.publicKey),
    privateKey: pair.secretKey.toString(),
    signer: pair,
  };
}

export function deriveFromMasterPair (signer: Keypair, dervation): Keypair {
  await ready
  const { path } = keyExtractPath(dervation)
  return keyFromPath(signer, path, 'sr25519')
}
