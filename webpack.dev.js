const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
    static: './dist', // serves the output folder
    compress: true,
    port: 8080,
    hot: true,
    open: true,
  },
});
