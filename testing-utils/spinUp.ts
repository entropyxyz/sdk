import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import rimraf from 'rimraf'

export const spinChain = async (
  bin: string
): Promise<ChildProcessWithoutNullStreams> => {
  const args = ['--dev']
  const process = spawn(bin, args)
  process.stderr.on('data', async function (chunk) {
    const message = chunk.toString()
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
  process.stderr.on('data', async function (chunk) {
    const message = chunk.toString()
    console.log(message, 'inside')
  })
  return process
}

export const removeDB = () => {
  rimraf('test_db')
  rimraf('kvstore')
}

export const sleep = (durationInMs: number) => {
  return new Promise((resolve) => setTimeout(resolve, durationInMs))
}
