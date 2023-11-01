interface ResolveType {
  (value?: void | PromiseLike<void>): void
}

interface ResObjectType {
  resolve: ResolveType
}

let isImported = false
let cryptoLib
const res: ResObjectType = { 
  resolve: () => { 
    throw new Error('resolve function not yet set')
  } 
}

loadCryptoLib()

/**
 * Interface for the cryptographic library, detailing core functionality: encryption, decryption, and key management.
 * 
 * @see {@link https://x25519-chacha20poly1305.vercel.app/x25519_chacha20poly1305/}
 */

export interface CryptoLib {
  from_hex: (input: string) => Uint8Array
   /** 
   * Encrypts the provided message and signs it using the X25519 and ChaCha20Poly1305 algorithms.
   * Uses the provided secret key for encryption and the server's Diffie-Hellman (DH) key for the signature.
   */ 
  encrypt_and_sign: (
    secretKey: Uint8Array,
    encoded: Uint8Array,
    serverDHKey: Uint8Array
  ) => Promise<string>
  /**
   * Decrypts a provided message and verifies its authenticity.
   * Uses the provided secret key for decryption.
   */
  decrypt_and_verify: (secretKey: Uint8Array, msg: string) => Promise<string>
  /** 
   * Derives the public key from the provided secret key.
   */
  public_key_from_secret: (secretKey: Uint8Array) => Promise<Uint8Array>
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
        throw new Error(
          `Function "${key as string}" is not available in the crypto library`
        )
      }

      return cryptoLib[key](...params)
    }
  },
})

/**
 * Dynamically loads the appropriate cryptographic library based on the runtime environment (Node.js or browser).
 * 
 * @returns The imported crypto library.
 */

export async function loadCryptoLib () {
  if (isImported) return cryptoLib

  if (typeof window === 'undefined') {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-nodejs')
  } else {
    cryptoLib = await import('@entropyxyz/x25519-chacha20poly1305-web')
  }
  isImported = true
  res.resolve()
  return cryptoLib
}
