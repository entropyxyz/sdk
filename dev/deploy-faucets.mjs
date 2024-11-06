import { readFileSync } from 'fs'
import { blake2AsHex, encodeAddress } from "@polkadot/util-crypto";
import Keyring from '@entropyxyz/sdk/keys'
import Entropy, { wasmGlobalsReady } from '@entropyxyz/sdk'
import { jumpStartNetwork, createTimeLogProxy } from '@entropyxyz/sdk/testing'
import { evilMonkeyAnimation } from './fun-bucket.mjs'

const endpoint = process.argv[2]
const fundingSeed = process.argv[3]
const faucetLookUpSeed = process.argv[4]



// change this number to deploy more faucets
const FAUCET_COUNT = 3
const BITS_PER_TOKEN = 1e10
// change me if you change the schemas!
const POINTER = '0x3a1d45fecdee990925286ccce71f78693ff2bb27eae62adf8cfb7d3d61e142aa'


if (!endpoint) throw new Error('please provide arguments for endpoint, fundingSeed, faucetLookUpSeed')
if (!fundingSeed) throw new Error('please provide arguments for fundingSeed, faucetLookUpSeed')
if (!faucetLookUpSeed) throw new Error('please provide arguments for faucetLookUpSeed')
// this is just a novel reporter object that gets logged
const report = createTimeLogProxy({ endpoint })
// run checks
checkEndpoint(endpoint)
checkSeed(faucetLookUpSeed)
checkSeed(fundingSeed)

const faucetAddresses = []
// actually run the function!
deployAndFundFaucet().then(() => process.exit(0)).catch((e) => {
  console.warn(report)
  console.error(e)
  process.exit(1)
})
// function defined
async function deployAndFundFaucet () {
  let monkeyAnimationStop = evilMonkeyAnimation()
  report.step = 'about to wait wasmGlobalsReady'
  await wasmGlobalsReady()
  report.step = 'completed waiting for wasmGlobalsReady'
  report.step = 'creating fundingSeed keyring'
  const moneyRing = new Keyring({
    seed: fundingSeed
  })
  report.step = 'created keyring for fundingSeed'
  report.step = 'creating faucetLookUpSeed keyring'
  const faucetRing = new Keyring({
    seed: faucetLookUpSeed
  })
  report.step = 'creating entropy for fundingSeed'
  const moneyBags = new Entropy({
    endpoint,
    keyring: moneyRing
  })
  report.step = 'created entropy for fundingSeed'
  report.step = 'creating entropy for faucetRing'
  const faucetEntropy = new Entropy({
    endpoint,
    keyring: faucetRing
  })
  report.step = 'created entropy for faucetRing'
  report.step = 'awaiting readys'
  await faucetEntropy.ready
  await moneyBags.ready
  report.step = 'entropys ready'
  report.step = 'getting jump start status'
  const jumpStartStatus = (await moneyBags.substrate.query.stakingExtension.jumpStartProgress()).toHuman().jumpStartStatus
  report.step = 'jump start status retrieved'
  report['jump start status at start'] = jumpStartStatus
  // deploy faucet program to chain if not already up
  if (jumpStartStatus === 'Ready') {
    report.step = 'starting jump start'
    await jumpStartNetwork(moneyBags, true)
    report.step = 'finished jump start'
    monkeyAnimationStop()
    monkeyAnimationStop = evilMonkeyAnimation()
  }
  report.step = 'getting faucet program on chain'
  const faucetProgramInfo = await moneyBags.programs.dev.get(POINTER)
  report.step = 'got faucet program on chain'
  report['using faucet program POINTER'] = POINTER
  if (faucetProgramInfo === null) {
    const faucetProgram = readFileSync(new URL('./faucet_program.wasm', import.meta.url))
    const configurationSchema = {
      type: 'object',
      properties: {
        max_transfer_amount: { type: "number" },
        genesis_hash: { type: "string" }
      }
    }
    const auxDataSchema = {
      type: 'object',
      properties: {
        amount: { type: "number" },
        string_account_id: { type: "string" },
        spec_version: { type: "number" },
        transaction_version: { type: "number" },
      }
    }
    report.step = 'deploying faucet program'
    report['faucet program POINTER from deployment'] = await moneyBags.programs.dev.deploy(faucetProgram, configurationSchema, auxDataSchema)
    report.step = 'deployed faucet program'
  }
  // transfer funds to faucet account "enough" to register (5 whole tokens)
  report.step = 'transferring funds to faucet look up address from funding account'
  await sendMoney(moneyBags, faucetRing.accounts.registration.address, BigInt(FAUCET_COUNT * BITS_PER_TOKEN))
  report.step = 'finish transfer'
  let faucetCountDown = FAUCET_COUNT
  const genesisHash = await moneyBags.substrate.rpc.chain.getBlockHash(0)
  const userConfig = {
    max_transfer_amount: 20_000_000_000,
    genesis_hash: genesisHash.toString().split('0x')[1]
  }
  report['faucet config'] = userConfig
  const faucets = []
  report.step = 'retrieving balance for funding account'
  const funderBalance = BigInt((await faucetEntropy.substrate.query.system.account(
    moneyRing.accounts.registration.address)).data.free)
  report.step = 'balance for funding account'
  report['initial balance for funding account'] = funderBalance.toLocaleString()
  // dont transfer all funds ¯\_(ツ)_/¯ so if we run out of faucet funds you still have a small nest egg
  const fundingAmount = funderBalance / BigInt(FAUCET_COUNT + 1)
  report['initial funding faucet amount'] = fundingAmount.toLocaleString()

  while (!!faucetCountDown) {
    report.step = 'registering a faucet'
    const vk = await faucetEntropy.register({
      programModAddress: faucetEntropy.keyring.accounts.registration.address,
      programData: [{
        program_pointer: POINTER,
        program_config: userConfig,
      }]
    })
    report.step = 'registration complete'
    const hashedKey = blake2AsHex(vk)
    const faucetAddress = encodeAddress(hashedKey, 42).toString()
    report.step = 'transferring funds to faucet address from funding account'
    await sendMoney(moneyBags, faucetAddress, fundingAmount)
    report.step = 'transfer complete'
    report.step = 'retrieving balance for new faucet'
    const balance = (await faucetEntropy.substrate.query.system.account(
      faucetAddress)).data.toHuman()
    report.step = 'balance for new faucet retrieved'

    faucets.push({
      'verification key': vk,
      address: faucetAddress,
      balance: balance.free.toLocaleString()
    })
    report['faucets'] = faucets
    --faucetCountDown
  }
  report.step = 'getting modifiableKeys from chain for sanity check'
  // These should be the same as faucets.map(faucet => faucet['verification key'])
  const modifiableKeys = await moneyBags.substrate.query.registry.modifiableKeys(faucetRing.accounts.registration.address)
  report.step = 'retrieved modifiableKeys from chain for sanity check'
  report['modifiableKeys on chain'] = modifiableKeys.toHuman()
  report['faucet look up address'] = faucetRing.accounts.registration.address
  report.finished = true
  monkeyAnimationStop()
  console.log(report)
}

function sendMoney(entropy, recipientAddress, amount) {
  return new Promise(async (resolve, reject) => {
    // WARN: await signAndSend is dangerous as it does not resolve
    // after transaction is complete :melt:
    const sender = entropy.keyring.accounts.registration.pair
    entropy.substrate.tx.balances
      .transferAllowDeath(recipientAddress, amount)
      .signAndSend(sender, ({ status, events, dispatchError }) => {
        if (dispatchError) {
          let msg
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = entropy.substrate.registry.findMetaError(
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
}


function checkSeed(seed) {
  if (seed.length !== 66) throw new Error('incompatible seed')
}

function checkEndpoint (endpoint) {
  if (!endpoint.startsWith('ws')) throw new Error('Please provide a ws endpoint')
}