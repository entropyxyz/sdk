import { keyShare } from './types'
import { AnyJson } from '@polkadot/types-codec/types'
import { utils } from 'ethers'
import { SignatureLike } from '@ethersproject/bytes'
import { isValidSubstrateAddress } from './utils'
import { Substrate } from '../substrate'
import { Constraints } from '../constraints'
import { ThresholdServer } from '../threshold-server'
import { ITransactionRequest, Arch } from '../threshold-server/types'
import { Crypto } from '../crypto'

/**
 * Encapsulates all subclasses and exposes functions to make interacting with entropy simple
 */
export default class Entropy {
  crypto: Crypto
  substrate: Substrate
  thresholdServer: ThresholdServer
  constraints: Constraints
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
  constructor(
    crypto: Crypto,
    substrate: Substrate,
    thresholdServer: ThresholdServer,
    constraints: Constraints
  ) {
    this.crypto = crypto
    this.substrate = substrate
    this.thresholdServer = thresholdServer
    this.constraints = constraints
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
  static async setup(seed: string, endpoint?: string): Promise<Entropy> {
    const crypto = new Crypto()
    const substrate = await Substrate.setup(seed, endpoint)
    const thresholdServer = new ThresholdServer()
    const constraints = new Constraints(substrate.api, substrate.signer)
    return new Entropy(crypto, substrate, thresholdServer, constraints)
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
  async register(props: {
    keyShares: keyShare[]
    constraintModificationAccount: string
    freeTx: boolean
    initialConstraints?: string
  }): Promise<AnyJson> {
    const {
      keyShares,
      constraintModificationAccount,
      freeTx,
      initialConstraints,
    } = props

    const isRegistered_check = await this.substrate.api.query.relayer.registered(
      this.substrate.signer.wallet.address
    )

    if (isRegistered_check.toHuman()) {
      throw new Error('already registered')
    }
    // TODO after typegen: typed Addresses
    if (!isValidSubstrateAddress(constraintModificationAccount)) {
      throw new Error(
        'constraintModificationAccount must be a Substrate address'
      )
    }

    //TODO JA better return type
    const serverKeys = await this.substrate.getStashKeys()
    const serverStashKeys = this.substrate.selectStashKeys(serverKeys)

    // TODO should we run validation here on the amount of keys to send
    // i.e make sure key shares is signing party big and stash keys are key shares -1 size
    const thresholdAccountsInfo: any = await this.substrate.getThresholdInfo(
      serverStashKeys
    )
    console.log(serverStashKeys, 'serverStashKeys from module')
    const encryptedMessages: Array<string> = []
    const urls: Array<string> = []
    for (let i = 0; i < serverStashKeys.length; i++) {
      const serverDHKey = await this.crypto.parseServerDHKey(
        thresholdAccountsInfo[i]
      )

      console.log(keyShares[i], i, keyShares, 'keyShares[i] from module')
      debugger
      const encryptedMessage = await this.crypto.encryptAndSign(
        this.substrate.signer.pair.secretKey,
        keyShares[i],
        serverDHKey
      )
      encryptedMessages.push(encryptedMessage)
      urls.push(thresholdAccountsInfo[i].endpoint)
    }

    const registerTx = this.substrate.api.tx.relayer.register(
      constraintModificationAccount,
      initialConstraints ? initialConstraints : null
    )

    await this.substrate.sendAndWaitFor(registerTx, freeTx, {
      section: 'relayer',
      name: 'SignalRegister',
    })

    await this.substrate.api.query.relayer.registering(
      this.substrate.signer.wallet.address
    )
    // TODO: JA handle result, log info? do nothing? assert it is true?
    await this.thresholdServer.sendKeys(encryptedMessages, urls)

    const isRegistered = await this.substrate.api.query.relayer.registered(
      this.substrate.signer.wallet.address
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
  async sign(
    tx: utils.UnsignedTransaction,
    freeTx: boolean,
    retries: number
  ): Promise<SignatureLike> {
    const serializedTx = await utils.serializeTransaction(tx)

    const sigHash = utils.keccak256(serializedTx)
    const submitHashOnchain = await this.substrate.api.tx.relayer.prepTransaction(
      {
        sigHash,
      }
    )
    const record = await this.substrate.sendAndWaitFor(
      submitHashOnchain,
      freeTx,
      {
        section: 'relayer',
        name: 'SignatureRequested',
      }
    )
    const urls = record.event.data.toHuman()[0].ipAddresses

    const evmTransactionRequest: ITransactionRequest = {
      arch: Arch.Evm,
      transaction_request: serializedTx,
      signing_address: this.substrate.signer.wallet.address,
    }

    await this.thresholdServer.pollNodeToStartSigning(
      evmTransactionRequest,
      urls,
      retries
    )

    const signature: SignatureLike = await this.thresholdServer.pollNodeForSignature(
      sigHash.slice(2),
      urls[0],
      retries
    )
    return signature
  }
}
