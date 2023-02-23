import 'mocha'
import Entropy from '../core'
import { spinChain, sleep } from '../testing-utils'
const { assert } = require('chai')

const aliceAddress = '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy'
const daveSeed =
  '0x868020ae0687dda7d57565093a69090211449845a7e11453612800b663307246' // `subkey inspect //Dave` 'secret seed'

describe('Constraint Tests', async () => {
  let entropy: Entropy
  let chainProcess

  const chainPath = process.cwd() + '/testing-utils/test-binaries/entropy'

  beforeEach(async function () {
    try {
      chainProcess = await spinChain(chainPath)
      // serverProcess1 = await spinThreshold(serverPath, 'alice', '3001')
      // serverProcess2 = await spinThreshold(serverPath, 'bob', '3002')
    } catch (e) {
      console.log(e)
    }
    await sleep(3000)
    entropy = await Entropy.setup(daveSeed)
  })

  afterEach(async function () {
    const substrate = entropy.substrate.api.disconnect()
    const chain = chainProcess.kill()

    await Promise.all([substrate, chain])
    await sleep(1000)
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

    // make sure constriants haven't been updated at all
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
  })
})
