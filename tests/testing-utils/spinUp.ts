import { ApiPromise, WsProvider } from '@polkadot/api'
import { stringToHex } from '@polkadot/util/string'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import rimraf from 'rimraf'

async function getApi (endpoint = 'ws://127.0.0.1:9944'): Promise<ApiPromise> {
  const wsProvider = new WsProvider(endpoint)
  const api = new ApiPromise({ provider: wsProvider })
  await api.isReady
  return api
}


export const modifyOcwPostEndpoint = async (
  endpoint: string,
  new_url: string
) => {
  const api = await getApi(endpoint)
  const key = 'propagation'
  const value = stringToHex(new_url)
  const keyValue = stringToHex(key)
  await api.rpc.offchain.localStorageSet('PERSISTENT', keyValue, value)
  console.log('  Set Feed  ' + ` ${new_url}` + ' Successful')
  console.log('  Insert Keys  ')
  console.log(' Successful')
  await disconnect(api)
}
export const spinChain = async (
  bin: string,
  name: string,
  port?: string
): Promise<ChildProcessWithoutNullStreams> => {
  // console.log(`Spinning up chain with binary: ${bin}, name: ${name}, port: ${port}`)
  const args = [
    `--base-path=.entropy/${name}`,
    '--rpc-port',
    port,
    `--${name}`,
    '--validator',
  ]
  if (name === 'dev') {
    args.push('--dev')
  } else if (name === 'alice') {
    args.push(
      '--node-key=0000000000000000000000000000000000000000000000000000000000000001'
    )
  } else {
    args.push(
      '--bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp'
    )
  }


  const process = spawn(bin, args)
  // comment in for chain logging and add verbose to jest
  // process.stderr.on('data', (data) => {
  //   console.log(`STDERR: ${data}`)
  // })

  // process.stdout.on('data', (data) => {
  //   console.log(`STDOUT: ${data}`);
  // });

  process.on('error', (error) => {
      console.error(`chain for ${name} Error in spinChain process: ${error.message}`)
  })
  process.on('exit', (code) => {
      console.log(`spinChain process exited with code: ${code}`)
  })
  return process
}

export const spinThreshold = async (
  bin: string,
  name: string,
  port: string
): Promise<ChildProcessWithoutNullStreams> => {
  // console.log(`Spinning up threshold with binary: ${bin}, name: ${name}, port: ${port}`)
  const args = []
  if (name) {
    args.push('--' + name, '--threshold-url=127.0.0.1:' + port)
  }
  const process = spawn(bin, args)
  await sleep(1000)
  // comment in for threshold logging and add verbose to jest
  // process.stdout.on('data', async function (chunk) {
  //   const message = chunk.toString()
  // console.log('Threshold chain data for ', name, ':', message)
  // })
  //   process.on('error', (error) => {
  //     console.error(`Error in spinThreshold process: ${error.message}`)
  // })
  // process.on('exit', (code) => {
  //     console.log(`spinThreshold process exited with code: ${code}`)
  // })
  return process
}

export const removeDB = async () => {
  await Promise.all([
    rimraf('test_db'),
    rimraf('kvstore')
  ])
  await sleep(1000)
};
export const sleep = (durationInMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationInMs))
}
export const disconnect = async (api: ApiPromise) => {
  console.log('Attempting to disconnect...')
  if (api.isConnected) {
    try {
      await api.disconnect()
      console.log('Disconnected successfully.')
    } catch (error) {
      console.error(`Error while disconnecting: ${error.message}`)
    }
  } else {
    console.log('API is already disconnected.')
  }
}
