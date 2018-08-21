const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const webpack = require('webpack');
const path = require('path');
const ip = require('ip');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const BUILD_PATH = '../dist';
const PROJECT_ROOT = path.resolve(__dirname, '../');
const manifestPath = path.join(PROJECT_ROOT, 'src/manifest.json');
const _dll = require('../.webpackrc.json');


module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        filename: '[name].[chunkhash:8].js', //此选项决定了每个输出 bundle 的名称
        chunkFilename: '[name].[chunkhash:8].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
        publicPath: '/'
    },
    devtool: 'source-map', //避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
    optimization: {
        runtimeChunk: 'single',
        minimize: true,
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    plugins: [
        
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash:8].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // new webpack.HashedModuleIdsPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            anaylzerHost: ip.address(),
            anaylzerPort: '8888',
            openAnalyzer: true,
            logLevel: 'silent',
        }),
    ]
});


if (_dll.enabled) {
    module.exports.plugins.push(
        new Webpack.DllReferencePlugin({
            context: PROJECT_ROOT,
            manifest: require(manifestPath),
        }),
    );
}

module.exports.plugins.unshift(
    new CleanWebpackPlugin([BUILD_PATH], {
        root: PROJECT_ROOT,
        verbose: true,
        dry: false
    }),
);
