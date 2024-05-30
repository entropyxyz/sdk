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

const NETWORK_TYPE = 'two-nodes'
const SUBSTRATE_DECIMALS = 10

/* utils ========================================*/
function createSeed() {
  return '0x' + randomBytes(32).toString('hex')
}
/* utils ========================================*/

test('Transfer', async (t) => {
  const run = promiseRunner(t)
  await run('network up', spinNetworkUp(NETWORK_TYPE))

  await sleep(process.env.GITHUB_WORKSPACE ? 30_000 : 5_000)

  // this gets called after all tests are run
  t.teardown(async () => {
    await Promise.all([charlie.close(), naynay.close()])
    await spinNetworkDown(NETWORK_TYPE).catch((error) =>
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

  const amount = BigInt(123_456 * 10 ** SUBSTRATE_DECIMALS)
  // WARNING: this fails if amount sent is too small
  await run(
    'transfer funds',
    new Promise(async (resolve, reject) => {
      const tx = await charlie.substrate.tx.balances.transferAllowDeath(
        recipientAddress,
        amount
      )
      // WARN: signAndSend returns a Promise, but unclear when it resolves,
      // and what the function it resolves with is :melt:
      const sender = charlie.keyring.accounts.registration.pair
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
    t.true(
      BigInt(accountInfo.data.free) < BigInt(1e21) - amount,
      // NOTE: actual amount charlie has is less a txn fee, but that fee is variable
      // It's on the order of BigInt(318373888)
      'initially charlie is less rich!'
    )
  }

  t.end()
})
