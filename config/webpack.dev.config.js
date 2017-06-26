const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PostcssConfigPath = './config/postcss.config.js';
const ip = require('ip');

const glob = require('glob');

const PAGE_PATH = path.resolve(__dirname, './src/pages');


let entrys = (() => {
    const entryList = {};

    const pattern = './src/pages/**/js/*.js';
    glob.sync(pattern).forEach((entry) => {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry);

        let key = entry.replace(/\.js$/, '').split('/pages/')[1];

        entryList[key] = pathname + '/' + basename;
    })

    return entryList;
})();

let htmlPlugin = Object.keys(entrys).map((val, index) => {

    let pagePath = val.split('/js/')[0];
    let pageName = val.split('/js/')[1];

    return new HtmlWebpackPlugin({
        filename: `${pagePath}/${pageName}.html`,//输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
        template: `./src/pages/${pagePath}/${pageName}.html`,//模板文件路径，支持加载器
        inject: 'body',
        chunks: ['common', val]//允许只添加某些块
    })
});

module.exports = {
    entry: entrys,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js', //此选项决定了每个输出 bundle 的名称
        chunkFilename: '[name].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
        publicPath: '/'
    },
    externals: {
        zepto: "window.$"
    },
    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'less-loader'
                }, {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: PostcssConfigPath
                        }
                    }
                }]
            })
        }, {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {
                            modules: false
                        }]
                    ],
                    plugins: ['syntax-dynamic-import'] //由于 import() 还是属于 Stage 3 的特性，所以你需要安装/添加 syntax-dynamic-import 插件来避免 parser 报错
                }
            }]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 100,
                    publicPath: '/',
                    name: 'images/[hash:8].[name].[ext]'
                }
            }]

        }, {
            test: /\.(eot|svg|ttf|woff)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 100,
                    publicPath: '/',
                    name: 'font/[name].[ext]?[hash:8]'
                }
            }]
        }, {
            test: /\.html$/,
            use: [{
                loader: 'html-withimg-loader'
            }]
        }]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('[name].css').replace('/js', '/css');
            },
            allChunks: true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common'
        }),
        ...htmlPlugin,
        new webpack.ProvidePlugin({
            $: 'zepto',
            jQuery: 'zepto'
        })
    ],
    devServer: {
        contentBase: [
            path.join(__dirname, 'src/')
        ],
        port: 8088,
        historyApiFallback: true,
        host: ip.address(),
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
}