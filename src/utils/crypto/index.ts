// let isImported = false
// let crypto
// const res = {}

// export const isLoaded = new Promise((resolve) => {
//   res.resolve = resolve
// })

// export async function loadCryptoLib () {
//   if (isImported) return crypto
//   // if node enviroment load node library
//   if (typeof window === 'undefined') {
//     crypto = await import(
//         '@entropyxyz/x25519-chacha20poly1305-nodejs'
//       )
//     isImported = true
//     res.resolve(true)
//     return crypto
//     } else {
//       crypto = await import(
//         '@entropyxyz/x25519-chacha20poly1305-web'
//       )
//       isImported = true
//       res.resolve(true)
//       return crypto
//     }
// }

let isImported = false;
let crypto;

interface ResolveType {
  resolve?: (value: boolean | PromiseLike<boolean>) => void;
}
const res: ResolveType = {};

export const isLoaded = new Promise<boolean>(resolve => res.resolve = resolve);

export async function loadCryptoLib() {
    if (isImported) return crypto;

    const lib = typeof window === 'undefined'
        ? '@entropyxyz/x25519-chacha20poly1305-nodejs'
        : '@entropyxyz/x25519-chacha20poly1305-web';

    crypto = await import(lib);
    isImported = true;
    res.resolve?.(true);  // Using optional chaining since resolve is optional
    
    return crypto;
}