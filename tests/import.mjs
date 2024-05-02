import { readFileSync } from 'fs'
// TODO: fix the "dist" thing
import Entropy from '../dist/index.js'
import { getWallet } from '../dist/keys/index.js'

try {
  const seed =
    '98fb1f513a1d979aab3e77e4cb447fc7b0d724924314af4fb8f12e0140adc584'
  const signer = await getWallet(seed).catch((err) =>
    console.error('getWallet failed', err)
  )

  const entropyAccount = {
    sigRequestKey: signer,
    programModKey: signer,
    programDeployKey: signer,
  }

  const entropy = new Entropy({ account: entropyAccount })
  await entropy.ready

  const programPath = new URL(
    './testing-utils/template_basic_transaction.wasm',
    import.meta.url
  )
  const basicTxProgram = readFileSync(programPath)

  // NOTE: dev.deploy is a confusing name... is this for dev net ? no
  // I propose API entropy.programs.deploy
  const programPointer = await entropy.programs.dev.deploy(basicTxProgram)

  // HACK: I was getting errors about having no money, so set `freeTx = true` to try and deploy???
  //
  // Now getting error:
  //
  // RpcError: -32601: RPC call is unsafe to be called externally
  //     at checkError (file:///home/projects/ENTROPY/sdk/node_modules/@polkadot/rpc-provider/coder/index.js:19:15)
  //     at RpcCoder.decodeResponse (file:///home/projects/ENTROPY/sdk/node_modules/@polkadot/rpc-provider/coder/index.js:35:9)
  //     at WsProvider.__internal__onSocketMessageResult (file:///home/projects/ENTROPY/sdk/node_modules/@polkadot/rpc-provider/ws/index.js:407:51)
  //     at WebSocket.__internal__onSocketMessage (file:///home/projects/ENTROPY/sdk/node_modules/@polkadot/rpc-provider/ws/index.js:396:20)
  //     at callListener (/home/projects/ENTROPY/sdk/node_modules/ws/lib/event-target.js:290:14)
  //     at WebSocket.onMessage (/home/projects/ENTROPY/sdk/node_modules/ws/lib/event-target.js:209:9)
  //     at WebSocket.emit (node:events:514:28)
  //     at Receiver.receiverOnMessage (/home/projects/ENTROPY/sdk/node_modules/ws/lib/websocket.js:1209:20)
  //     at Receiver.emit (node:events:514:28)
  //     at /home/projects/ENTROPY/sdk/node_modules/ws/lib/receiver.js:608:16

  console.log(programPointer)

  console.log('DONE')
} catch (err) {
  console.log(err)
}
