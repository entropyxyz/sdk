import { ApiPromise } from '@polkadot/api'
import { stringToHex } from '@polkadot/util/string'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import rimraf from 'rimraf'
import { getApi } from '../../src/utils'

export const modifyOcwPostEndpoint = async (
  endpoint: string,
  new_url: string
) => {
  try {
    // console.log(`Connecting to endpoint: ${endpoint}`)
    const apiFactory = await getApi()
    const api = await apiFactory(endpoint)

    const key = 'propagation'
    const value = stringToHex(new_url)
    const keyValue = stringToHex(key)
    await api.rpc.offchain.localStorageSet('PERSISTENT', keyValue, value)
    // console.log(`Set Feed to ${new_url} successfully.`)
    // console.log('Inserted keys successfully.')
    await disconnect(api)
  } catch (error) {
    console.error(`Error in modifyOcwPostEndpoint: ${error.message}`)
  }
}

export const spinChain = async (
  bin: string,
  name: string,
  port?: string
): Promise<ChildProcessWithoutNullStreams> => {
  // console.log(`Spinning up chain with binary: ${bin}, name: ${name}, port: ${port}`)
  let args = []
  args = [
    // '--dev',
    `--base-path=.entropy/${name}`,
    //  TODO: Talk to jesse about why this isnt a option
    '--rpc-port',
    port,
    `--${name}`,
    '--validator',
  ]

  if (name != 'alice') {
    args.push(
      '--bootnodes=/ip4/127.0.0.1/tcp/30333/p2p/12D3KooWEyoppNCUx8Yx66oV9fJnriXwCcXwDDUA2kj6vnc6iDEp'
    )
  }

  if (name == 'alice') {
    args.push(
      '--node-key=0000000000000000000000000000000000000000000000000000000000000001'
    )
  }

  const process = spawn(bin, args)
  // comment in for chain logging and add verbose to jest
  // process.stderr.on('data', async function (chunk) {
  //   const message = chunk.toString()
  //   console.log(name, ': ', {message})
  // })

  // process.on('error', (error) => {
  //     console.error(`chain for ${name} Error in spinChain process: ${error.message}`)
  // })
  // process.on('exit', (code) => {
  //     console.log(`spinChain process exited with code: ${code}`)
  // })
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

export const removeDB = () => {
  rimraf('test_db')
  rimraf('kvstore')
}

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
