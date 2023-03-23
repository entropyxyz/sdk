import Entropy from '../core'
import { spinChain, sleep } from '../testing-utils'
const { assert } = require('chai')

const aliceAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'
const daveSeed =
  '0x868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246' // `subkey inspect //Dave` 'secret seed'

describe('Constraint Tests', () => {
  let entropy: Entropy
  let chainProcess

  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'

  beforeEach(async function () {
    try {
      chainProcess = await spinChain(chainPath, 'dev')
    } catch (e) {
      console.log(e)
    }
    await sleep(7000)
    entropy = await Entropy.setup(daveSeed)
  })

  afterEach(async function () {
    chainProcess.kill()
    await entropy.substrate.api.disconnect()
  })
  it(`constraints can be updated by authorized user`, async () => {
    const newConstraints = {
      evmAcl: {
        addresses: ['0x1000000000000000000000000000000000000000'],
        kind: 'Allow',
        allowNullRecipient: false,
      },
    }

    const initialConstraints = await entropy.constraints.getEvmAcl(aliceAddress)

    const randomConstraintsSeed =
      '0x1a7d114100653850c65edecda8a9b2b4dd65d900edef8e70b1a6ecdcda967056' // `subkey inspect //Bob//stash` 'secret seed'
    const randomEntropy = await Entropy.setup(randomConstraintsSeed)
    const aliceConstraintEntropy = await Entropy.setup(daveSeed)

    // make sure random user cannot update her constraints
    try {
      await randomEntropy.constraints.updateAccessControlList(
        newConstraints,
        aliceAddress
      )
      throw Error //shouldn't get here
    } catch (e: any) {
      assert.equal(
        e.message,
        "constraints.NotAuthorized: Constraint account doesn't have permission to modify these constraints"
      )
    }

    // make sure constraints haven't been updated at all
    const constraint = await entropy.constraints.getEvmAcl(aliceAddress)
    assert.equal(constraint.toString(), initialConstraints.toString())
    // update constraints with AliceStash
    await aliceConstraintEntropy.constraints.updateAccessControlList(
      newConstraints,
      aliceAddress
    )

    // make sure constraints have been updated
    const constraints2 = await entropy.constraints.getEvmAcl(aliceAddress)
    assert.notEqual(constraints2.toString(), initialConstraints.toString())
    assert.equal(constraints2.toString(), JSON.stringify(newConstraints.evmAcl))
    await aliceConstraintEntropy.substrate.api.disconnect()
    await randomEntropy.substrate.api.disconnect()
  })
})
