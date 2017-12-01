const {resolve} = require('path');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './index.js',
  
  output: {
    path: __dirname,
    filename: 'd3.webpack.js',
    libraryTarget: 'commonjs'
  },
  
  module: {
    rules: [{
      // Compile ES2015 using buble
      test: /\.js$/,
      loader: 'buble-loader',
      include: [resolve('.')],
      exclude: [/node_modules/],
      options: {
        objectAssign: 'Object.assign'
      }
    }]
  }
};
