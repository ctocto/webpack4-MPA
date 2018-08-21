const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const IsProduction = process.env.NODE_ENV === 'production';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack');
const HappyThreadPool = HappyPack.ThreadPool({ size: (IsProduction ? 10 : 4) });

const PostcssConfigPath = './config/postcss.config.js';
const PROJECT_ROOT = path.resolve(__dirname, '../');
const manifestPath = path.join(PROJECT_ROOT, 'src/manifest.json');
const webpackrc = require('../.webpackrc.json'); 
const {commonVendors, browserSupports} = webpackrc; 


//入口
let entrys = (() => {
    let entryList = {};

    const pattern = './src/pages/**/js/*.js';
    glob.sync(pattern).forEach((entry) => {
        let basename = path.basename(entry, path.extname(entry)),
            pathname = path.dirname(entry);

        let key = entry.replace(/\.js$/, '').split('/pages/')[1].replace('/js', '');

        const entryFile = pathname + '/' + basename;
        entryList[key] = entryFile;
    })

    return entryList;
})();

//html plugin
let htmlPlugins = (() => {
    const res = Object.keys(entrys).map((val) => {

        let pagePath = val.split('/')[0];
        let pageName = val.split('/')[1];
    
        return new HtmlWebpackPlugin({
            filename: `${pagePath}/${pageName}.html`,//输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
            template: `./src/pages/${pagePath}/${pageName}.html`,//模板文件路径，支持加载器
            inject: 'body',
            chunks: [
                'runtime',
                'common',
                'vendors',
                val
            ],
            chunksSortMode: 'none',
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: false,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            }
        })
    });

    return res;
})();

if (commonVendors && commonVendors.length) {
    entrys = {
        'common': commonVendors,
        ...entrys
    };
}

module.exports = {
    context: process.cwd(),
    entry: entrys,
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, '../src/pages'),
                loader: 'babel-loader'
            },
            {
                test: /\.(less|css)$/,
                use: [
                    IsProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: IsProduction
                        }
                    },
                    {
                        loader: 'less-loader'
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: PostcssConfigPath
                            }
                        }
                    }
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'asstes/[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: 'file-loader',
                options: {
                    name: 'asstes/[name].[ext]?[hash]'
                }
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
        new HappyPack({
            id: 'js',
            threads: 4,
			threadPool: HappyThreadPool,
			loaders: ['babel-loader']
		}),
		new HappyPack({
            id: 'styles',
            threads: 4,
			threadPool: HappyThreadPool,
			loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
		}),
        new webpack.DllReferencePlugin({
            context: PROJECT_ROOT,
            manifest: manifestPath
        }),
        ...htmlPlugins,
        new AddAssetHtmlPlugin({
            filepath: path.resolve(PROJECT_ROOT, './src/dll/*.js'),
        }),
    ]
}