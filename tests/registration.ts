// import RegistrationManager from '../src/registration'
// import { getWallet } from '../src/keys'
// import Entropy from './../src'
// import {
//   spinChain,
//   spinThreshold,
//   removeDB,
//   disconnect,
//   modifyOcwPostEndpoint,
//   charlieSeed,
//   charlieAddress,
//   charlieStashSeed,
//   charlieStashAddress,
//   whitelisted_test_tx_req,
//   non_whitelisted_test_tx_req,
//   whitelisted_test_constraints,
// } from './testing-utils'
// import { sleep } from '../src/utils'
// import { WsProvider } from '@polkadot/api';

// import { KeyShare } from '../src/types'
// import { ApiPromise } from '@polkadot/api'
// import { ThresholdServer } from '../old/src/threshold-server'
// import { Wallet } from 'ethers'
// const { assert } = require('chai')

// // describe('Registration Tests', () => {
// //   let entropy: RegistrationManager
// //   let chainProcess1, chainProcess2, serverProcess1, serverProcess2

// //   const chainPath = process.cwd() + 'tests/testing-utils/test-binaries/entropy'
// //   const serverPath = process.cwd() + 'tests/testing-utils/test-binaries/server'

// //   beforeEach(async function () {
// //     try {
// //       serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
// //       serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
// //       chainProcess1 = await spinChain(chainPath, 'alice', '9944')
// //       await sleep(3000)
// //       chainProcess2 = await spinChain(chainPath, 'bob', '9945')
// //     } catch (e) {
// //       console.log(e)
// //     }
// //     await sleep(9000)
// //     await modifyOcwPostEndpoint(
// //       'ws://127.0.0.1:9945',
// //       'http://localhost:3002/signer/new_party'
// //     )

//     const seed: string = charlieSeed
//     const endpoint: string = 'ws://127.0.0.1:9944'
//     const wsProvider = new WsProvider(endpoint)
//     const substrate: ApiPromise = await ApiPromise.create({ provider: wsProvider })

// //   const signer = await getWallet(seed)

//   entropy = new RegistrationManager({ substrate, signer })

// //   })

// //   afterEach(async function () {
// //     await disconnect(this.substrate)
// //     await sleep(3000)
// //     serverProcess1.kill()
// //     serverProcess2.kill()
// //     chainProcess1.kill()
// //     chainProcess2.kill()
// //     await sleep(3000)
// //     removeDB()
// //   })

//   it('should perform registration', async () => {
//     // register user on-chain and with threshold servers
//     const charlieStashEntropy = new Entropy({
//       seed: charlieSeed,
//       endpoint: 'ws://127.0.0.1:9944',
//     })
//     await entropy.register({
//       initialProgram: charlieStashAddress,
//       freeTx: false,
//     })

// //     // const no_constraint: any = new Entropy(
// //     //   whitelisted_test_tx_req,
// //     //   false,
// //     //   3
// //     // )

// //     // assert.equal(no_constraint.length, 0) // not sure what this is?

// //     await disconnect(charlieStashEntropy.substrate.substrate)
// //   })
// // })
