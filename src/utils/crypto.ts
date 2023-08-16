let isImported = false
let cryptoLib
const res: any = {}
loadCryptoLib()

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})


export const crypto = new Proxy({}, {
  get: (_, key) => {
    return async (...params) => {
      await cryptoIsLoaded
      return cryptoLib[key](...params)
    }
  }
})


export async function loadCryptoLib () {
  if (isImported) return cryptoLib
  // if node enviroment load node library
  if (typeof window === 'undefined') {
    cryptoLib = await import(
      '@entropyxyz/x25519-chacha20poly1305-nodejs'
    )
    isImported = true
    res.resolve(true)
    return cryptoLib
  } else {
    cryptoLib = await import(
      '@entropyxyz/x25519-chacha20poly1305-web'
    )
    isImported = true
    res.resolve(true)
    return cryptoLib
  }
}