import { readFileSync } from 'fs'
import { blake2AsHex, encodeAddress } from "@polkadot/util-crypto";
import Keyring from '@entropyxyz/sdk/keys'
import Entropy, { wasmGlobalsReady } from '@entropyxyz/sdk'
import { jumpStartNetwork } from '@entropyxyz/sdk/testing'
const endpoint = process.argv[2]
const fundingSeed = process.argv[3]
const faucetLookUpSeed = process.argv[4]
const pointer = '0x3a1d45fecdee990925286ccce71f78693ff2bb27eae62adf8cfb7d3d61e142aa'
if (!endpoint) throw new Error('please provide arguments for endpoint, fundingSeed, faucetLookUpSeed')
if (!fundingSeed) throw new Error('please provide arguments for fundingSeed, faucetLookUpSeed')
if (!faucetLookUpSeed) throw new Error('please provide arguments for faucetLookUpSeed')
const report = {}
checkEndpoint(endpoint)
checkSeed(faucetLookUpSeed)
checkSeed(fundingSeed)

const faucetAddresses = []

deployAndFundFaucet().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })

async function deployAndFundFaucet () {
  await wasmGlobalsReady()
  const moneyRing = new Keyring({
    seed: fundingSeed
  })
  const faucetRing = new Keyring({
    seed: faucetLookUpSeed
  })
  const moneyBags = new Entropy({
    endpoint,
    keyring: moneyRing
  })
  const faucetEntropy = new Entropy({
    endpoint,
    keyring: faucetRing
  })
  await faucetEntropy.ready
  await moneyBags.ready
  const jumpStartStatus = (await moneyBags.substrate.query.stakingExtension.jumpStartProgress()).toHuman().jumpStartStatus
  report['jump start status at start'] = jumpStartStatus
  // deploy faucet program to chain if not already up
  if (jumpStartStatus === 'Ready') await jumpStartNetwork(moneyBags, true)
  const faucetProgramInfo = await moneyBags.programs.dev.get(pointer)
  report['using faucet program pointer'] = pointer
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
    report['faucet program pointer from deployment'] = await moneyBags.programs.dev.deploy(faucetProgram, configurationSchema, auxDataSchema)
  }
  // transfer funds to faucet account enough to register (5 whole tokens)
  await sendMoney(moneyBags, faucetRing.accounts.registration.address, BigInt(5 * 10 ** 10))
  let faucetCount = 3
  const genesisHash = await moneyBags.substrate.rpc.chain.getBlockHash(0)
  const userConfig = {
    max_transfer_amount: 20_000_000_000,
    genesis_hash: genesisHash.toString().split('0x')[1]
  }
  report['faucet config'] = userConfig
  const faucets = []
  const funderBalance = BigInt((await faucetEntropy.substrate.query.system.account(
    moneyRing.accounts.registration.address)).data.free)
  report['initial balance for funding account'] = funderBalance
  const fundingAmount = funderBalance / BigInt(4)
  report['initial funding faucet amount'] = fundingAmount

  while (!!faucetCount) {
    const vk = await faucetEntropy.register({
      programModAddress: faucetEntropy.keyring.accounts.registration.address,
      programData: [{
        program_pointer: pointer,
        program_config: userConfig,
      }]
    })
    const hashedKey = blake2AsHex(vk)
    const faucetAddress = encodeAddress(hashedKey, 42).toString()
    await sendMoney(moneyBags, faucetAddress, fundingAmount)
    const balance = (await faucetEntropy.substrate.query.system.account(
      faucetAddress)).data.toHuman()
    faucets.push({
      vk,
      address: faucetAddress,
      balance: balance.free
    })
    --faucetCount
  }
  const modifiableKeys = await moneyBags.substrate.query.registry.modifiableKeys(faucetRing.accounts.registration.address)
  report['modifiableKeys on chain'] = modifiableKeys.toHuman()
  report['faucet look up address'] = faucetRing.accounts.registration.address
  report['faucets'] = faucets
  report.endpoint = endpoint
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
  if (seed.length < 66) throw new Error('incompatible seed')
  if (seed.length > 66) throw new Error('incompatible seed')
}

function checkEndpoint (endpoint) {
  if (!endpoint.startsWith('ws')) throw new Error('Please provide a ws endpoint')
}