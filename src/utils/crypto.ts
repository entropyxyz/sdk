

let isImported = false
let cryptoLib
const res: any = {}
loadCryptoLib()

export interface CryptoLib {
  from_hex: (input: string) => Uint8Array
  encrypt_and_sign: (secretKey: Uint8Array, encoded: Uint8Array, serverDHKey: Uint8Array) => Promise<string>
  decrypt_and_verify:  (secretKey: Uint8Array, decoded: Uint8Array, serverDHKey: Uint8Array) => Promise<string>
}

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})


export const crypto: CryptoLib = new Proxy({} as CryptoLib, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      if (!cryptoLib) {
        throw new Error('cryptoLib loaded incorrectly')
      }
      if (!cryptoLib[key]) {
        throw new Error(`Function "${key as string}" is not available in the crypto library`)
      }

      return cryptoLib[key](...params)
    }
  }
})

export async function loadCryptoLib () {
  console.log(isImported, cryptoLib)
  if (isImported) return cryptoLib

  if (typeof window === 'undefined') {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-nodejs')
  } else {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-web')
  }

  console.log("Loaded cryptoLib:", cryptoLib)

  isImported = true
  res.resolve(true)
  return cryptoLib
}