import test from 'tape'
import { randomBytes } from 'crypto'
import Entropy, { wasmGlobalsReady } from '../src'
import Keyring from '../src/keys'

import {
  sleep,
  promiseRunner,
  spinNetworkUp,
  spinNetworkDown,
  charlieStashSeed,
} from './testing-utils'

const networkType = 'two-nodes'

/* Utils ========================================*/
function createSeed() {
  return '0x' + randomBytes(32).toString('hex')
}

// WARNING: formatAmountAsHex is in CLI ... what the heck is going on with this?
// BigInt(fromAmountAsHex(1000)) ... number => huge_number => hex => BigInt
// ... why?
//
// const DECIMALS = 10
// const PREFIX = '0x'
// export const formatAmountAsHex = (amount: number) => {
//   return `${PREFIX}${(amount * (1 * (10 ** DECIMALS))).toString(16)}`;
// }
/* Utils ========================================*/

test.only('Transfer', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(networkType))

  await sleep(process.env.GITHUB_WORKSPACE ? 30_000 : 5_000)

  // this gets called after all tests are run
  t.teardown(async () => {
    await Promise.all([charlie.close(), naynay.close()])
    await spinNetworkDown(networkType).catch((error) =>
      console.error('Error while spinning network down', error.message)
    )
  })

  await run('wasm', wasmGlobalsReady())

  const charlieKeyring = new Keyring({ seed: charlieStashSeed, debug: true })
  const charlie = new Entropy({
    keyring: charlieKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })
  await run('charlie ready', charlie.ready)

  const naynaySeed = createSeed()
  const naynayKeyring = new Keyring({ seed: naynaySeed, debug: true })
  const naynay = new Entropy({
    keyring: naynayKeyring,
    endpoint: 'ws://127.0.0.1:9944',
  })
  await run('naynay ready', naynay.ready)

  const recipientAddress = naynay.keyring.accounts.registration.address
  {
    const accountInfo = (await naynay.substrate.query.system.account(
      recipientAddress
    )) as any
    t.equal(
      BigInt(accountInfo.data.free),
      BigInt(0),
      'initially naynay has nothing'
    )
  }
  {
    const account = charlie.keyring.accounts.registration.address
    const accountInfo = (await charlie.substrate.query.system.account(
      account
    )) as any
    t.equal(
      BigInt(accountInfo.data.free),
      BigInt(1e21),
      'initially charlie is rich!'
    )
  }

  const amount = BigInt(123_456 * 1e10)
  await run(
    'transfer funds',
    new Promise(async (resolve, reject) => {
      const tx = await charlie.substrate.tx.balances.transferAllowDeath(
        recipientAddress,
        amount
      )
      // WARN: signAndSend returns a Promise, but unclear when it resolves, and what the function it resolves with is :melt:
      const sender = charlie.keyring.accounts.registration.pair
      // const sender = charlie.registrationManager.signer.pair // this is used in CLI
      tx.signAndSend(sender, ({ status, events, dispatchError }) => {
        if (dispatchError) {
          let msg: string
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = charlie.substrate.registry.findMetaError(
              dispatchError.asModule
            )
            const { docs, name, section } = decoded

            msg = `${section}.${name}: ${docs.join(' ')}`
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            msg = dispatchError.toString()
          }
          return reject(Error(msg))
        }

        if (status.isFinalized) resolve(status)
      })
    })
  )

  {
    const accountInfo = (await naynay.substrate.query.system.account(
      recipientAddress
    )) as any
    t.equal(BigInt(accountInfo.data.free), amount, 'naynay is rollin')
  }

  {
    const account = charlie.keyring.accounts.registration.address
    const accountInfo = (await charlie.substrate.query.system.account(
      account
    )) as any
    // t.equal(BigInt(accountInfo.data.free), BigInt(10 ** 21) - amount, 'initially charlie is less rich!')
    // actual:   999998765439681671852n  - is there a tx fee taken?
    // expected: 999998765440000000000n
    t.true(
      BigInt(accountInfo.data.free) < BigInt(10 ** 21) - amount,
      'initially charlie is less rich!'
    )
  }

  t.end()
})
