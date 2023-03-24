import { ApiPromise } from '@polkadot/api'
import { stringToHex } from '@polkadot/util/string'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import rimraf from 'rimraf'
import { getApi } from '../substrate'

export const modifyOcwPostEndpoint = async (
  endpoint: string,
  new_url: string
): Promise<ApiPromise> => {
  const api = await getApi(endpoint)
  const key = 'propagation'
  const value = stringToHex(new_url)
  const keyValue = stringToHex(key)
  await api.rpc.offchain.localStorageSet('PERSISTENT', keyValue, value)
  console.log('  Set Feed  ' + ` ${new_url}` + ' Successful')
  console.log('  Insert Keys  ')
  console.log(' Successful')
  return api
}

export const spinChain = async (
  bin: string,
  name: string,
  port?: string
): Promise<ChildProcessWithoutNullStreams> => {
  let args = []
  if (name == 'dev') {
    args = ['--dev']
  } else {
    args = [
      `--base-path=.entropy/${name}`,
      '--chain=local',
      '--ws-port',
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
  }

  const process = spawn(bin, args)
  // comment in for chain logging and add verbose to jest
  // process.stderr.on('data', async function (chunk) {
  //   const message = chunk.toString()
  //   console.log({message})
  // })
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
  // comment in for threshold logging and add verbose to jest
  // process.stderr.on('data', async function (chunk) {
  //   const message = chunk.toString()
  //   console.log(message)
  // })
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
