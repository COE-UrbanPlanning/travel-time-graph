const {resolve} = require('path');
const webpack = require('webpack');
const path = require('path');

const CONFIG = {
  entry: {
    bundle: resolve('./app.js')
  },

  devtool: 'source-map',

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
  },
  
  resolve: {
    alias: {
      'd3$': './d3/d3.webpack.js'
    }
  },
  
  output: {
    //path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "/assets/"
  },
  
  watch: true

  // Optional: Enables reading mapbox token from environment variable
  //plugins: [
    //new webpack.EnvironmentPlugin(['MapboxAccessToken'])
  //]
};

module.exports = env => env ? require('../webpack.config.local')(CONFIG)(env) : CONFIG;

