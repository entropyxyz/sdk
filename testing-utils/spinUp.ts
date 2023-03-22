import { to_hex } from '@entropyxyz/x25519-chacha20poly1305-nodejs'
import { Int } from '@polkadot/types-codec'
import { stringToHex } from "@polkadot/util/string";
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import rimraf from 'rimraf'
import { getApi } from '../substrate'

// const endpoint = "ws://localhost:9946";
// const new_url = "http://localhost:3002/signer/new_party";
export const changeEndpoint = async (endpoint: string,  new_url: string) => {
  const api = await getApi(endpoint);
	const key = "propagation";
	const value = stringToHex(new_url);
	const keyValue = stringToHex(key);
	await api.rpc.offchain.localStorageSet("PERSISTENT", keyValue, value);
	console.log("  Set Feed  " + ` ${new_url}` + " Successful");
	console.log("  Insert Keys  ");
	console.log(" Successful");
  await api.disconnect()
}

export const spinChain = async (
  bin: string,
  name: string,
  port: string
): Promise<ChildProcessWithoutNullStreams> => {
  const args = ['--dev', '--ws-port', port, '--name', name]
  // call insertKey -> change the 
  const process = spawn(bin, args)
  process.stderr.on('data', async function (chunk) {
    const message = chunk.toString()
    console.log({message: message});
    let ready
    while (!ready) {
      ready =
        message.includes('Running JSON-RPC WS server:') ||
        message.includes('Listening for new connections')
      await sleep(1000)
    }
  })
  return process
}

export const spinThreshold = async (
  bin: string,
  name: string,
  port: string
): Promise<ChildProcessWithoutNullStreams> => {
  const args = []
  if (name) {
    args.push('--' + name)
  }
  const process = spawn(bin, args, {
    env: { ROCKET_PORT: port, ROCKET_ADDRESS: '127.0.0.1' },
  })
  await sleep(1000)
  return process
}

export const removeDB = () => {
  rimraf('test_db')
  rimraf('kvstore')
}

export const sleep = (durationInMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationInMs))
}
