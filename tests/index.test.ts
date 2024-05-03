import tape from 'tape'

tape('Test Suite', async (t) => {
  const tests = [
    require('./template.test.ts'),
    require('./end-to-end.test.ts'),
    require('./keys.test.ts'),
  ]
  // const count = tests.reduce((agg, test) => {
  //   // how many tests in that test
  //   return agg + test.count;
  // }, 0);
  // t.plan(count);
  await tests.forEach(async (test) => {
    // console.log('test suite', test);
    if (!test) return
    // console.log('test count', test.count);
    // t.plan(test.count);
    await test.runner(t)
  })
})
