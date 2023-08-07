const test = require('tape')

const process = require('process')

// Printing current directory
console.log("Current working directory: ",
process.cwd())
const RegistrationManager = require('../src/registration/index.ts')
test((t) => {
  t.plan(1)
  t.fail('i fail for fun')
})