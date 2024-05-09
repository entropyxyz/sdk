import {
  sr25519PairFromSeed,
  mnemonicToMiniSecret,
  mnemonicGenerate,
  keyFromPath,
  keyExtractPath,
  encodeAddress
} from '@polkadot/util-crypto'


export const UIDv4regex = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i


export async function seedFromMnemonic (m) {
  return mnemonicToMiniSecret(m)
}

// for the device key generate a random number example: `device-key:${uid}`
export function getPath ({type, uid}: {type: string, uid: UIDv4}): string {
  if (UIDv4regex.test(uid)) {
    return `//entropy//${type}///${UIDV4}`
  }
  throw new TypeError('uid is not correct type please provide the correct regex matching string')
}


export function generateMnemonic () {
  return mnemonicGenerate()
}

export function generateSeed (): string {
  const mnemonic = mnemonicGenerate()
  const mnemonicMini = mnemonicToMiniSecret(mnemonic)
}



/**
 * @param seed {@link string}
 * @param derivation {@link string}
 * @returns Signer {@link Signer}
 * generates A usable signer with meta info about the account i.e. address etc
 * */

export function generateKeyPairFromSeed (seed: string, dervation?: string): { address: string;, pair: PoladotSigner } {
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
    pair,
  };
}

export function deriveFromMasterPair (signer: Keypair, dervation): Keypair {
  const { path } = keyExtractPath(dervation)
  return keyFromPath(signer, path, 'sr25519')
}
