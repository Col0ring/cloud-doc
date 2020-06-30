const path = require('path')
const webpack = require('webpack')

webpack({
  mode: 'production',
  target: 'electron-main',
  entry: path.join(__dirname, '../main.js'),
  output: {
    filename: 'main.js',
    path: path.join(__dirname, '../build')
  },
  node: {
    __dirname: false
  }
}).run()
