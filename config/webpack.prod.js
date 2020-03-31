const merge = require("webpack-merge");
const common = require("./webpack.common.js");

const webpack = require("webpack");
const path = require("path");
const ip = require("ip");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const OptmizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");

const webpackrc = require("../.webpackrc.json");
const PROJECT_ROOT = path.resolve(__dirname, "../");
const BUILD_PATH = webpackrc.buildPath ? webpackrc.buildPath : "./dist";

module.exports = merge(common, {
  mode: "production",
  output: {
    path: path.resolve(PROJECT_ROOT, BUILD_PATH),
    filename: "[name].[chunkhash:8].js", //此选项决定了每个输出 bundle 的名称
    chunkFilename: "[name].[chunkhash:8].js", //此选项决定了按需加载(on-demand loaded)的 chunk 文件的名称
    publicPath: webpackrc.publicPath || "/"
  },
  devtool: "source-map", //避免在生产中使用 inline-*** 和 eval-***，因为它们可以增加 bundle 大小，并降低整体性能。
  optimization: {
    runtimeChunk: true, //指的是 webpack 的运行环境(具体作用就是模块解析, 加载) 和 模块信息清单
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            // we want terser to parse ecma 8 code. However, we don't want it
            // to apply any minfication steps that turns valid ecma 5 code
            // into invalid ecma 5 code. This is why the 'compress' and 'output'
            // sections only apply transformations that are ecma 5 safe
            // https://github.com/facebook/create-react-app/pull/4234
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
            // Disabled because of an issue with Terser breaking valid code:
            // https://github.com/facebook/create-react-app/issues/5250
            // Pending futher investigation:
            // https://github.com/terser-js/terser/issues/120
            inline: 2
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            // Turned on because emoji and regex is not minified properly using default
            // https://github.com/facebook/create-react-app/issues/2488
            ascii_only: true
          }
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
        // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: false
      }),

      new OptmizeCssAssetsWebpackPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require("cssnano"),
        cssProcessorOptions: {
          safe: true,
          discardComments: {
            removeAll: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
          priority: -10
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash:8].css"
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new webpack.HashedModuleIdsPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: "server",
      anaylzerHost: ip.address(),
      anaylzerPort: "8888",
      openAnalyzer: true,
      logLevel: "silent"
    })
  ]
});

module.exports.plugins.unshift(
  new CleanWebpackPlugin()
);
