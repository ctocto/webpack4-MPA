const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const PostcssConfigPath = './config/postcss.config.js';

const glob = require('glob');

const PAGE_PATH = path.resolve(__dirname, './src/pages');
const BUILD_PATH = 'build';

let entrys = (() => {
    const entryList = {};
    
    const pattern = './src/pages/**/js/*.js';
    glob.sync(pattern).forEach( (entry) => {
        let basename = path.basename(entry, path.extname(entry)),
        pathname = path.dirname(entry);

        let key = entry.replace(/\.js$/, '').split('/pages/')[1];

        entryList[key] = pathname + '/' + basename;
    } )

    return entryList;
})();

let htmlPlugin = Object.keys(entrys).map((val, index) => {

    let pagePath = val.split('/js/')[0];
    let pageName = val.split('/js/')[1];

    return new HtmlWebpackPlugin({
        filename: `${pagePath}/${pageName}.html`,
        template: `./src/pages/${pagePath}/${pageName}.html`,
        inject: 'body',
        chunks: ['common', val]
    })
});


module.exports = {
    entry: entrys,
    output: {
        path: path.resolve(__dirname, BUILD_PATH),
        filename: '[name].[chunkhash:8].js', //此选项决定了每个输出 bundle 的名称
        chunkFilename: '[name].[chunkhash:8].js', //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
        publicPath: '/'
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        publicPath: '',
                        name: '/assets/[hash:8].[name].[ext]'
                    }
                }]

            },
            {
                test: /\.(eot|svg|ttf|woff)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 100,
                        publicPath: '',
                        name: '/assets/[name].[ext]?[hash:8]'
                    }
                }]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-withimg-loader'
                }]
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true
            },
            compress: {
                screw_ie8: true
            },
            comments: false
        }),
        new ExtractTextPlugin({
            filename: (getPath) => {
                return getPath('[name].[contenthash:8].css').replace('/js', '/css');
            },
            allChunks: true
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: '[name]/bundle.[chunkhash:8].js'
        }),
        ...htmlPlugin,
        new CleanWebpackPlugin(
            [BUILD_PATH+'/**/*.js', BUILD_PATH+'/**/*.css'], 　 //匹配删除的文件
            {
                root: __dirname, //根目录
                verbose: true,
                　　　　　　　　　　 //开启在控制台输出信息
                dry: false　　　　　　　　　　 //启用删除文件
            }
        )
    ]

}