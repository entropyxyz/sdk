import { execFileSync } from 'child_process'
import { getWallet } from '../src/keys'
import { charlieStashSeed, disconnect, sleep } from './testing-utils'
import Entropy, { EntropyAccount } from '../src'

// requires should be after import sorry frankie
const tape = require('tape')

let entropy: Entropy



tape('should return hello', (t) => {
  const tests = [
    require('./template.test.ts'),
    require('./end-to-end.test.ts'),
  ]
  const count = tests.reduce((agg, test) => {
    // how many tests in that test
    return agg + test.count
  }, 0)

  t.plan(count)
  tests.forEach((test) => {
    if (!test) return
    test.runner(t)
  })
  t.end()
})
