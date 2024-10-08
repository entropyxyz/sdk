// this is here to make the exports less "messy"
// and also if you dont know about package.json you can
// still import or require see test tests/require.test.cjs
// next time you look at the build system
// ask your self is node done with require?
module.exports = require('./dist/index.cjs')
