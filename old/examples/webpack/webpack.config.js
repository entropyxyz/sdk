const path = require('path')

module.exports = {
  entry: './src/index.js',
  experiments: {
    asyncWebAssembly: true,
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
