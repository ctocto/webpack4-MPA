const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { proxy } = require('../.webpackrc');
const { getPort, getHost } = require('./utils');

module.exports = merge(common, {
  mode: 'development',
  cache: true,
  output: {
    filename: '[name].js', //此选项决定了每个输出 bundle 的名称
    chunkFilename: '[name].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: false,
    hot: true,
    port: getPort(),
    historyApiFallback: true,
    host: getHost(),
    inline: true,
    compress: true,
    clientLogLevel: 'none',
    noInfo: true,
    stats: 'none',
    open: true,
    openPage: 'webpack-dev-server',
    overlay: {
      // 当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    useLocalIp: true,
  },
  watch: true,
  stats: 'none',
});

if (proxy && JSON.stringify(proxy) !== '{}') {
  Object.assign(module.exports.devServer, {
    proxy
  });
}
