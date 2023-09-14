import { decodeAddress, encodeAddress } from '@polkadot/keyring'
import { hexToU8a, isHex } from '@polkadot/util'
import { ApiPromise, WsProvider } from '@polkadot/api'




export function stripHexPrefix (str: string, sigHash: string): string {
  if (str.startsWith('0x')) return sigHash.slice(2);
  return str;
}

export function isValidSubstrateAddress (address: string) {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address))

    return true
  } catch (error) {
    return false
  }
}

export function sleep (delay: number) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

/// changed what used to be constructApiGetterFuntion

type ApiFactory = (endpoint?: string) => Promise<ApiPromise>

export async function getApi (): Promise<ApiFactory> {
  const apis: { [key: string]: ApiPromise } = {}

  return async (endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> => {
    if (apis[endpoint]) {
      return apis[endpoint]
    }

    const wsProvider = new WsProvider(endpoint)
    const api = new ApiPromise({ provider: wsProvider })
    await api.isReady

    apis[endpoint] = api
    return api
  }
}

export async function sendHttpPost (url: string, data: any): Promise<any> {
  const headers = {
    'Content-Type': 'application/json',
  }
  return fetch(url, {
    method: 'POST',
    headers,
    body: data,
  })
}

export async function readKeyasync (path: string): Promise<Uint8Array> {
  if (!path) {
    throw new Error('Path is required');
  }

  if (typeof window === 'undefined') {
 
    const { readFileSync } = await import('fs');
    const buffer = readFileSync(path);

    const result = new Uint8Array(buffer.byteLength);
    buffer.copy(result);
    buffer.fill(0);
    return result;
  } else {
    // If we are in the browser, we need to use the FileReader API
    const file = new FileReader();
    const result: Promise<Uint8Array> = new Promise((resolve, reject) => {
      file.onload = () => {
        const buffer = new Uint8Array(file.result as ArrayBuffer);
        resolve(buffer);
      };
      file.onerror = (error) => reject(error);
    });
    file.readAsArrayBuffer(new Blob([path]));

    return result;
  }
}


export function u8ArrayToString (array: Uint8Array): string {
  return new TextDecoder().decode(array)
}

export function stringToU8Array (str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

export function decodeVecU8ToArrayBuffer (data: any): Uint8Array {
  return new Uint8Array(data)
}

export function decodeArrayBufferToString (buf: ArrayBuffer): string {
  return new TextDecoder().decode(new Uint8Array(buf))
}
