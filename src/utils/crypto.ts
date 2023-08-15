let isImported = false
let crypto
const res: any = {}

export const cryptoIsLoaded: Promise<void> = new Promise((resolve) => {
  res.resolve = resolve
})

export async function loadCryptoLib () {
  if (isImported) return crypto
  // if node enviroment load node library
  if (typeof window === 'undefined') {
    crypto = await import(
        '@entropyxyz/x25519-chacha20poly1305-nodejs'
      )
    isImported = true
    res.resolve(true)
    return crypto
    } else {
      crypto = await import(
        '@entropyxyz/x25519-chacha20poly1305-web'
      )
      isImported = true
      res.resolve(true)
      return crypto
    }
}