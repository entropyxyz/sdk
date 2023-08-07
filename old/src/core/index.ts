import { keyShare, UserTransactionRequest } from './types'
import { AnyJson } from '@polkadot/types-codec/types'
import { utils } from 'ethers'
import { SignatureLike } from '@ethersproject/bytes'
import { isValidSubstrateAddress } from './utils'
import { Substrate } from '../substrate'
import { Constraints } from '../constraints'
import { ThresholdServer } from '../threshold-server'
import { ITransactionRequest, Arch, EncMsg } from '../threshold-server/types'
import { Crypto } from '../crypto'
import { Adapters } from '../adapters'
import { Adapter } from '../adapters/types'
/**
 * Encapsulates all subclasses and exposes functions to make interacting with entropy simple
 */
export default class Entropy {
  crypto: Crypto,
  net: Substrate,
  thresholdServer: ThresholdServer,
  constraints: Constraints,
  adapters: Adapters,
  /**
   * @alpha
   *
   *
   * Creates an instance of Entropy.
   * @param {Crypto} crypto - {@link Crypto} The Crypto class from the crypto package
   * @param {Substrate} substrate {@link Substrate} - The Substrate class from the substrate package
   * @param {ThresholdServer} thresholdServer {@link ThresholdServer} - The thresholdServer class from the threshold server package
   *
   * @returns {*} {@link Entropy} An Entropy class instance
   */
  constructor(opts: {
    crypto: Crypto;
    substrate: Substrate;
    thresholdServer: ThresholdServer;
    constraints: Constraints;
    customAdapters: Adapter[]
  }) {
    this.crypto = opts.crypto
    this.net = opts.substrate
    this.thresholdServer = opts.thresholdServer
    this.constraints = opts.constraints
    this.adapters = new Adapters({ opts.customAdapters })
  }

  /**
   * @remarks
   * Launches all sub classes encapsulated by {@link Entropy}  class
   *
   * @static
   * @param {string} seed - private key of user interacting with entropy
   * @param {string} [endpoint] - an endpoint for the entropy blockchain (will default to localhost:9944)
   * @return {*} - {Promise<Entropy>} - An Entropy class instance {@link Entropy}
   */
  static async create({ seed, endpoint, account, customAdapters }: { seed: string, endpoint?: string, account?: any, customAdapters?: Adapter[]}): Promise<Entropy> {
    const crypto = new Crypto()
    const substrate = await Substrate.setup(seed, endpoint)
    const thresholdServer = new ThresholdServer()
    const constraints = new Constraints(substrate.substrate, substrate.signer)
    return new Entropy({crypto, substrate, thresholdServer, constraints, account, customAdapters})
  }

  /**
   * @alpha
   *
   * @remarks
   * Registers a user in the entropy blockchain

   *
   * @param {keyShare[]} keyShares - {@link keyShare} - Entropy threshold keys to be distributed (including your own to be stored)?
   * @param {string} constraintModificationAccount - The account that will be used to modify constraints after registration
   * @param {boolean} freeTx - use the free tx pallet
   * @param {string} [initialConstraints] - Initial constraints to be set on the relayer
   *
   * @return {*}  {Promise<AnyJson>} {@link AnyJson} - A JSON return from the chain which contains a boolean of if the registration was successful
   */
  async register({ keyShares, constraintModificationAccount, freeTx = true, initialConstraints }: {
    keyShares: keyShare[]
    constraintModificationAccount: string
    freeTx?: boolean
    initialConstraints?: string
  }): Promise<AnyJson> {

    // TODO after typegen: typed Addresses

    // check the format of the program key


    if (!isValidSubstrateAddress(constraintModificationAccount)) {
      throw new Error(
        'constraintModificationAccount must be a Substrate address'
      )
    }
    // is it already registered?
    const isCurrentlyRegistered = await this.net.isRegistered(
      this.net.signer.wallet.address
    )
    if (isCurrentlyRegistered) throw new Error('already registered')


    //TODO JA better return type

     // get the server keys toencrypt
    const serverKeys = await this.net.getStashKeys()
    const serverStashKeys = this.net.selectStashKeys(serverKeys)

    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo: any = await this.net.getThresholdInfo(serverStashKeys)

    const keys: Array<{ encryptedKeys: string; serversWithPort: string; }> = await Promise.all(thresholdAccountsInfo.map(async (thresholdAccountInfo, index) => {
      const serverDHKey = await this.crypto.parseServerDHKey(
        thresholdAccountInfo
      )
      const encryptedKey = await this.crypto.encryptAndSign(
        this.net.signer.pair.secretKey,
        keyShares[index],
        serverDHKey
      )
      return { encryptedKey, url }
    }))

    const registerTx = this.net.substrate.tx.relayer.register(
      constraintModificationAccount,
      initialConstraints ? initialConstraints : null
    )

    await this.net.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })

    // @Jesse question: what is the return value of this?
    await this.net.substrate.query.relayer.registering(
      this.net.signer.wallet.address
    )
    // TODO: JA handle result, log info? do nothing? assert it is true?
    await this.thresholdServer.sendKeys(keys)

    const isRegistered = await this.net.substrate.query.relayer.registered(
      this.net.signer.wallet.address
    )
    return isRegistered.toHuman()
  }

  /**
   *
   * Sign a tx (for ethereum currently) using the entropy blockchain. This will take an unsigned tx and return
   * a signature, it is up to the user to handle from there
   *
   * @param {utils.UnsignedTransaction} tx - {@link UnsignedTransaction} - The transaction to be signed
   * @param {boolean} freeTx - use the free tx pallet
   * @param {number} retries - To be deprecated when alice signs with the validators, but polling for sig retries
   * @return {*}  {Promise<SignatureLike>} {@link SignatureLike} - A signature to then be included in a transaction
   */
  async sign({sigRequest, arch, freeTx = true, retries}:{
    sigRequestHash: string;
    freeTx?: boolean;
    retries?: number;
  }): Promise<SignatureLike> {
    /* this might be a weird thing*/
    const stashKeysGroups = await this.net.getStashKeys()
    const stashKeys = stashKeysGroups.reduce((agg, group) => {
      const index = parseInt(sigRequest, 16) % group.length
      agg.push(group[index])
    }, [])

    const validatorsInfo = await Promise.all(stashKeys.map((stashKey) =>{
      return this.net.substrate.query.stakingExtension.thresholdServers(stashKey)
    }))

    const txRequests: Array<EncMsg> = []
    const transactionRequest: UserTransactionRequest = {
      arch,
      transaction_request: sigRequestHash,
      validator_ips: validatorsInfo.map((validator) => validator.ip_address),
    }

    const txRequests: Array<EncMsg> = await Promise.all(validatorsInfo.map(async (validator) => {
      // use buffere from iunit8 to string 'hex'
      const serverDHKey = await this.crypto.parseServerDHKey({
        x25519PublicKey: validatorsInfo[i].x25519PublicKey,
      })

      const encoded = Uint8Array.from(

// FINISH THE FORMAT OF NEW TRANSACTION


        JSON.stringify({
          ...transactionRequest
        }),
        (x) => x.charCodeAt(0)
      )

      const encryptedMessage = await this.crypto.encryptAndSign(
        this.net.signer.pair.secretKey,
        encoded,
        serverDHKey
      )
      return {
        url: validatorsInfo[i].ipAddress,
        encMsg: encryptedMessage,
      }
    }))


    await this.thresholdServer.pollNodeToStartSigning(txRequests, retries)

    const signature: SignatureLike = await this.thresholdServer.pollNodeForSignature(
      sigHash.slice(2),
      validatorsInfo[0].ipAddress,
      retries
    )
    return signature
  }


  /**
   *
   * Sign a tx (for ethereum currently) using the entropy blockchain. This will take an unsigned tx and return
   * a signature, it is up to the user to handle from there
   *
   * @param {utils.UnsignedTransaction} tx - {@link UnsignedTransaction} - The transaction to be signed
   * @param {boolean} freeTx - use the free tx pallet
   * @param {number} retries - To be deprecated when alice signs with the validators, but polling for sig retries
   * @return {*}  {Promise<SignatureLike>} {@link SignatureLike} - A signature to then be included in a transaction
   */
  async signTransation({tx, freeTx = true, retries, type = 'eth'}:{
    tx: utils.UnsignedTransaction,
    freeTx?: boolean,
    retries?: number
  }): Promise<SignatureLike> {
    if (!this.adapters[type]) throw new TypeError(`Can not sign transactions for ${type}, unknown transaction type`)
    if (this.adapters[type].preSign) {
      const hash = await this.adapters[type].preSign(tx)
      if (!hash) throw new TypeError(`The ${type} adapter preSign function did not return a hash instead returned ${hash}`)
      else if (typeof hash !== 'string') throw new TypeError(`Incorrect return type from ${type} adapter preSign function got ${hash} expected a string`)
      else {
        const signature = await this.sign(hash)
        if (this.adapters[type].postSign) return this.adapters[type].postSign(signature)
        return signature
      }
    }
  }
}
