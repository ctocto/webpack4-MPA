const path = require('path');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const FirendlyErrorePlugin = require('friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');
const WebpackWatchedGlobEntries = require('./webpack-watched-glob-entries-plugin');
// const HappyPack = require('happypack');
// const HappyThreadPool = HappyPack.ThreadPool({ size: (IsProduction ? 10 : 4) });

const IsProduction = process.env.NODE_ENV === 'production';
const IsDev = process.env.NODE_ENV === 'development';
const PostcssConfigPath = './config/postcss.config.js';
const { getDevDoneLog, getHtmlPlugins, PROJECT_ROOT } = require('./utils');
const manifestPath = path.join(PROJECT_ROOT, 'src/manifest.json');
const { commonVendors, alias, dll } = require('../.webpackrc');


//html plugin
let htmlPlugins = getHtmlPlugins();


module.exports = {
  context: process.cwd(),
  target: 'web',
  entry: WebpackWatchedGlobEntries.getEntries('./src/pages/**/js/*.js', {
    ignore: '**/*.module.js'
  }, {
    extend: {
      common: commonVendors,
    }
  }),
  stats: 'none',
  resolve: {
    alias
  },
  module: {
    rules: [
      // 前置(在执行编译之前去执行eslint-loader检查代码规范，有报错就不执行编译)
      // {
      //   enforce: 'pre',
      //   test: /.js$/,
      //   loader: 'eslint-loader',
      //   include: path.resolve(PROJECT_ROOT, 'src/pages'),
      //   options: {
      //     fix: true,
      //     cache: IsDev,
      //     failOnError: IsProduction, // 生产环境发现代码不合法，则中断编译
      //     useEslintrc: true,
      //     emitWarning: IsDev
      //   },
      //   exclude: /node_modules|dll/
      // },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.resolve(PROJECT_ROOT, './src'),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          IsDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IsDev,
              config: {
                path: PostcssConfigPath
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        loaders: [
          IsDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IsDev,
              config: {
                path: PostcssConfigPath
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: IsDev
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          esModule: false, // https://stackoverflow.com/questions/59070216/webpack-file-loader-outputs-object-module
          name: 'asstes/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: 'asstes/[name].[ext]?[hash:8]'
        }
      },
      {
        test: /\.(htm|html|art)$/i,
        loader: 'art-template-loader',
        options: {
          imports: require.resolve('art-template/lib/runtime')
        }
      },
    ]
  },
  plugins: [
    // new HappyPack({
    //     id: 'js',
    //     threads: 4,
    // 	threadPool: HappyThreadPool,
    // 	loaders: ['babel-loader']
    // }),
    // new HappyPack({
    //     id: 'styles',
    //     threads: 4,
    // 	threadPool: HappyThreadPool,
    // 	loaders: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
    // }),
    new FirendlyErrorePlugin(),
    new WebpackBar({
      reporter: {
        allDone({ state }) {
          if (IsDev) {
            console.log('\n');
            console.log(getDevDoneLog())
          }
        }
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: 'Webpack MPA🤖',
      logo: path.resolve(PROJECT_ROOT, './public/favicon.ico'),
      suppressSuccess: true
    }),
    ...htmlPlugins,
  ]
};

// 开启 dll
if (dll.enable) {
  // 告诉 Webpack 使用了哪些动态链接库
  module.exports.plugins.splice(-1, 0, new webpack.DllReferencePlugin({
    context: PROJECT_ROOT,
    // 描述 lodash 动态链接库的文件内容
    manifest: manifestPath
  }));
  module.exports.plugins.push(new AddAssetHtmlPlugin({
    filepath: path.resolve(PROJECT_ROOT, './src/dll/*.js')
  }));
}
