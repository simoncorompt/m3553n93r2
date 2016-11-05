const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: 'dist'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader', 'shebang-loader'],
        include: path.join(__dirname, 'src')
      },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ]
  },
  target: 'node',
  externals: [nodeExternals()]
}
