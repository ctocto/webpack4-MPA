const webpack = require('webpack');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const PROJECT_ROOT = path.resolve(__dirname, '../');
const entrys = require('../.webpackrc.json').dll.include; 
const manifestPath = path.join(PROJECT_ROOT, 'src/manifest.json');

module.exports = {
    entry: entrys,
    context: process.cwd(),
    output: {
        path: path.join(PROJECT_ROOT, 'src/dll'),
        filename: 'dll.[name].[hash:8].js',
        library: '[name]',
    },
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin([
            'src/dll'
        ], {
            root: PROJECT_ROOT,
            verbose: true,
            dry: false,
        }),
        new webpack.DllPlugin({
            context: PROJECT_ROOT,
            path: manifestPath,
            name: '[name]'
        })
    ]
}