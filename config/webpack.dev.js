const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { proxy } = require('../.webpackrc');
const { getPort, getHost, Logger, clearConsole } = require('./utils');

const config =  merge(common, {
  mode: 'development',
  cache: true,
  output: {
    filename: '[name].js', //此选项决定了每个输出 bundle 的名称
    chunkFilename: '[name].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
    publicPath: '/'
  },
  devtool: 'inline-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  // watch: true,
  stats: 'none',
});

const devServer = {
  contentBase: false,
  hot: true,
  historyApiFallback: true,
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
};

if (proxy && JSON.stringify(proxy) !== '{}') {
  Object.assign(devServer, {
    proxy
  });
}


async function start() {
  try {
    const port = await getPort();
    devServer.port = port;

    const compiler = webpack(config);

    const server = new webpackDevServer(compiler, devServer);
    server.listen(port, getHost(), () => {
      clearConsole();
    });
  } catch (error) {
    Logger.error(error)
  }
}

start();
// watching.close(() => {
//   console.log('\x1B[32m%s\x1B[0m', '\nClosed\n')
// })