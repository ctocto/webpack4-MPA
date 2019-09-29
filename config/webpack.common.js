const path = require("path");
const glob = require("glob");
const webpack = require("webpack");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
const WebpackBuildNotifierPlugin = require("webpack-build-notifier");
const FirendlyErrorePlugin = require("friendly-errors-webpack-plugin");
const WebpackBar = require("webpackbar");
// const HappyPack = require('happypack');
// const HappyThreadPool = HappyPack.ThreadPool({ size: (IsProduction ? 10 : 4) });
let runtime = require("art-template/lib/runtime");

const IsProduction = process.env.NODE_ENV === "production";
const IsDev = process.env.NODE_ENV === "development";
const PostcssConfigPath = "./config/postcss.config.js";
const PROJECT_ROOT = path.resolve(__dirname, "../");
const manifestPath = path.join(PROJECT_ROOT, "src/manifest.json");
const webpackrc = require("../.webpackrc.json");
const { getDevDoneLog } = require('./utils');
const { commonVendors } = webpackrc;
// @see http://aui.github.io/art-template/webpack/index.html#Filter
// 模板变量
runtime.Date = () => {
  return global.Date;
};

//入口
let entrys = (() => {
  let entryList = {};

  const pattern = "./src/pages/**/js/*.js";
  glob.sync(pattern).forEach(entry => {
    let basename = path.basename(entry, path.extname(entry)),
      pathname = path.dirname(entry);

    let key = entry
      .replace(/\.js$/, "")
      .split("/pages/")[1]
      .replace("/js", "");

    const entryFile = pathname + "/" + basename;
    entryList[key] = entryFile;
  });

  return entryList;
})();

//html plugin
let htmlPlugins = (() => {
  const res = Object.keys(entrys).map(val => {
    let pagePath = val.split("/")[0];
    let pageName = val.split("/")[1];

    return new HtmlWebpackPlugin({
      filename: `${pagePath}/${pageName}.html`, //输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有子目录。
      template: `./src/pages/${pagePath}/${pageName}.html`, //模板文件路径，支持加载器
      inject: "body",
      chunks: ["runtime", "common", "vendors", val],
      chunksSortMode: "none",
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
        minifyURLs: true
      }
    });
  });

  return res;
})();

if (commonVendors && commonVendors.length) {
  entrys = {
    common: commonVendors,
    ...entrys
  };
}

module.exports = {
  context: process.cwd(),
  target: "web",
  entry: entrys,
  stats: "none",
  module: {
    rules: [
      // 前置(在执行编译之前去执行eslint-loader检查代码规范，有报错就不执行编译)
      {
        enforce: "pre",
        test: /.js$/,
        loader: "eslint-loader",
        include: path.resolve(PROJECT_ROOT, "src/pages"),
        options: {
          fix: true,
          cache: IsDev,
          failOnError: IsProduction, // 生产环境发现代码不合法，则中断编译
          useEslintrc: true,
          emitWarning: IsDev
        },
        exclude: /node_modules|dll/
      },
      {
        test: /\.js$/,
        loaders: ["babel-loader"],
        include: path.resolve(PROJECT_ROOT, "./src"),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loaders: [
          IsDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
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
          IsDev ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              sourceMap: IsDev,
              config: {
                path: PostcssConfigPath
              }
            }
          },
          {
            loader: "less-loader",
            options: {
              sourceMap: IsDev
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          name: "asstes/[name].[ext]?[hash:8]"
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: "file-loader",
        options: {
          name: "asstes/[name].[ext]?[hash:8]"
        }
      },
      {
        test: /\.(htm|html|art)$/i,
        loader: "art-template-loader",
        options: {
          imports: require.resolve("art-template/lib/runtime")
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
            console.log();
            console.log(getDevDoneLog())
          }
        }
      }
    }),
    new WebpackBuildNotifierPlugin({
      title: "Webpack MPA🤖",
      logo: path.resolve(PROJECT_ROOT, "./public/favicon.ico"),
      suppressSuccess: true
    }),
    new webpack.DllReferencePlugin({
      context: PROJECT_ROOT,
      manifest: manifestPath
    }),
    ...htmlPlugins,
    new AddAssetHtmlPlugin({
      filepath: path.resolve(PROJECT_ROOT, "./src/dll/*.js")
    })
  ]
};
