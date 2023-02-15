import { WebSocket, Server } from 'mock-socket'
const fakeServer = 'ws://localhost:9944'
/*
 * By default the global WebSocket object is stubbed out. However,
 * if you need to stub something else out you can like so:
 */
window.WebSocket = WebSocket // Here we stub out the window object
const blockchainServer = new Server(fakeServer)
blockchainServer.on('connection', (socket) => {
  socket.on('message', (data) => {
    console.log('message', data)
  })
  socket.on('close', () => {
    console.log('close')
  })
})

// blockchainServer.send(
//   JSON.stringify({
//     action: 'create',
//     payload: {
//       username: 'host-user',
//     },
//   })
// )

/*
 * By default the global WebSocket object is stubbed out. However,
 * if you need to stub something else out you can like so:
 */
window.WebSocket = WebSocket // Here we stub out the window object
const gameHostSocket = new window.WebSocket('ws://localhost:5000')
gameHostSocket.send(
  JSON.stringify({
    // TODO: Get the websocket response from the blockchain server
  })
)

const onMessage = async (event) => {
  const data = JSON.parse(event.data)
  // @ts-expect-error
  window.blockID = data.block?.id
}

blockchainServer?.addEventListener('message', onMessage)

// deal with jsdom issue
window.HTMLMediaElement.prototype.load = () => {
  /* do nothing */
}
// @ts-expect-error
window.HTMLMediaElement.prototype.play = () => {}
window.HTMLMediaElement.prototype.pause = () => {}
// @ts-expect-error
window.HTMLMediaElement.prototype.addTextTrack = () => {}
