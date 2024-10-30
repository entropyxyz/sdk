import { readFileSync } from 'fs'
import { blake2AsHex, encodeAddress } from "@polkadot/util-crypto";
import Keyring from '@entropyxyz/sdk/keys'
import Entropy, { wasmGlobalsReady } from '@entropyxyz/sdk'
import { jumpStartNetwork } from '@entropyxyz/sdk/testing'
const endpoint = process.argv[2]
const fundingSeed = process.argv[3]
const faucetLookUpSeed = process.argv[4]
const { ENTROPY_JUMPSTART } = process.env
const pointer = '0x2eaf750c4fa0fe125ca8a9d4037c0c0608b57ae70d6586dc6acdfcb4e9872deb'
if (!endpoint) throw new Error('please provide arguments for endpoint, fundingSeed, faucetLookUpSeed')
if (!fundingSeed) throw new Error('please provide arguments for fundingSeed, faucetLookUpSeed')
if (!faucetLookUpSeed) throw new Error('please provide arguments for faucetLookUpSeed')

checkEndpoint(endpoint)
checkSeed(faucetLookUpSeed)
checkSeed(fundingSeed)

// const fundingSeed = '0x358f394d157e31be23313a1500f5e2c8871e514e530a35aa5c05334be7a39ba6'

// const faucetLookUpSeed = '0xacdfa69a15317a1cf1b5ae13977f7274f4bdb20f9e38c2f1b107a693361fb80d'
// const faucetLookUpAddress = '5F1uqENGb157HJt6J7bJHLgHyMuEw75VFsmXspdWDYNPXWuG'
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
  // deploy faucet program to chain if not already up
  if (ENTROPY_JUMPSTART) await jumpStartNetwork(moneyBags, true)
  const faucetProgramInfo = await moneyBags.programs.dev.get(pointer)
  if (faucetProgramInfo === null) {
    const faucetProgram = readFileSync(new URL('./faucet_program.wasm', import.meta.url))
    const configurationSchema = {
      max_transfer_amount: "number",
      genesis_hash: "string"
    }
    const auxDataSchema = {
      amount: "number",
      string_account_id: "string",
      spec_version: "number",
      transaction_version: "number",
    }
    console.log('deploying faucet')
    console.log('faucet pointer:', await moneyBags.programs.dev.deploy(faucetProgram, configurationSchema, auxDataSchema))
  }
  // transfer funds to faucet account enough to register (5 whole tokens)
  await sendMoney(moneyBags, faucetRing.accounts.registration.address, BigInt(5 * 10 ** 10))
  let faucetCount = 3
  const genesisHash = await moneyBags.substrate.rpc.chain.getBlockHash(0)
  const userConfig = {
    max_transfer_amount: 20_000_000_000,
    genesis_hash: genesisHash.toString().split('0x')[1]
  }
  console.log('faucet config:', userConfig)
  const faucets = []
  const funderBalance = BigInt((await faucetEntropy.substrate.query.system.account(
    moneyRing.accounts.registration.address)).data.free)
  console.log('funderBalance', funderBalance)
  const fundingAmount = funderBalance / BigInt(4)
  while (!!faucetCount) {
    const vk = await faucetEntropy.register({
      programData: [{
        program_pointer: pointer,
        program_config: userConfig,
      }]
    })
    const hashedKey = blake2AsHex(vk)
    const faucetAddress = encodeAddress(hashedKey, 42).toString()
    console.log('funding faucet', vk)
    sendMoney(moneyBags, faucetAddress, fundingAmount)
    const balance = BigInt((await faucetEntropy.substrate.query.system.account(
      faucetAddress)).data.free).toString()
    faucets.push({
      vk,
      address: faucetAddress,
      balance
    })
    --faucetCount
  }
  const modifiableKeys = await moneyBags.substrate.query.registry.modifiableKeys(faucetRing.accounts.registration.address)
  console.log('modifiableKeys', modifiableKeys.toJSON(), 'for:', faucetRing.accounts.registration.address)
  console.log(`
    faucet look up address: ${faucetRing.accounts.registration.address}
    faucets:

      ${JSON.stringify(faucets[0])}

      ${JSON.stringify(faucets[1])}

      ${JSON.stringify(faucets[2])}
    endpoint: ${endpoint}

    `)
}

function sendMoney(entropy, recipientAddress, amount) {
  return new Promise(async (resolve, reject) => {
    // WARN: await signAndSend is dangerous as it does not resolve
    // after transaction is complete :melt:
    const sender = entropy.keyring.accounts.registration.pair
    console.log(`transferring funds for registering from: ${sender.address} to: ${recipientAddress} for: ${amount}`)
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