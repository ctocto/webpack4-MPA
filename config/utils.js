const path = require("path");
const chalk = require("chalk");
const ip = require("ip");
const glob = require("glob");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const port = 8089;

function getHost() {
  return ip.address();
}

function getPort(params) {
  return port;
}

function clearConsole() {
  process.stdout.write(
    process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'
  );
}

function getDevDoneLog() {
  const host = getHost();
  return `
  You can now view ${chalk.bold('Your App')} in the browser.
  
    ${chalk.bold('Local:')}            http://localhost:${port}/
    ${chalk.bold('On Your Network:')}  http://${host}:${port}/
  
  Note that the development build is not optimized.
  To create a production build, use ${chalk.hex('#00a6cc')('npm run build')}.`;
}

function getEntrys(pattern) {
  let entryList = {};
  
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
}

function getHtmlPlugins(entrys) {
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
}

module.exports = {
  getPort,
  getHost,
  getDevDoneLog,
  clearConsole,
  getEntrys,
  getHtmlPlugins
}