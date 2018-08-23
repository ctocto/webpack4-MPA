const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const proxy = require('../.webpackrc.json').proxy;

const webpack = require('webpack');
const path = require('path');
const ip = require('ip');

const BUILD_Dir = '../';


module.exports = merge(common, {
    mode: 'development',
    cache: true,
    output: {
        path: path.resolve(__dirname, BUILD_Dir),
        filename: '[name].js', //此选项决定了每个输出 bundle 的名称
        chunkFilename: '[name].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: [
            path.join(__dirname, 'src/')
        ],
        hot: true,
        port: 8088,
        historyApiFallback: true,
        host: ip.address(),
        inline: true
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
});

if (proxy && JSON.stringify(proxy) !== '{}') {
    Object.assign(module.exports.devServer, {
        proxy
    });
}