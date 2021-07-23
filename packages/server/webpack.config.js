const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')

const excludeNodeModules = ['hexon-api']
const nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1
  })
  .filter(mod => !excludeNodeModules.includes(mod))
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {
  target: 'node',
  entry: './src/server.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  plugins: [new CleanWebpackPlugin()],
  mode: 'production',
  externals: nodeModules
}
