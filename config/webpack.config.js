const webpack = require('webpack');
const path = require('path');

module.exports = function (env) {
    return require(`./webpack.${env}.config.js`)
}