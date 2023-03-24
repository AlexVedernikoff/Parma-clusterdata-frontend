const { generateConfig } = require('./webpack.config-base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BI_PATH, EXPORT_PATH } = require('./../src/context-path');

const biHost = `${ BI_PATH }`;
const portalHost = '';
const exportHost = `${ EXPORT_PATH }`;

const mode = 'production';
const devServer = {};
const devtool = false;
const htmlPluginCard = new HtmlWebpackPlugin({
  filename: 'card.html',
  template: './src/card.html',
  chunks: ['vendors', 'commons', 'app', 'card'],
  component: 'app',
  templateParameters: {
    dotenv: '<%- dotenv %>',
  },
  biHost,
  portalHost,
  hash: true,
});

module.exports = generateConfig({ biHost, portalHost, exportHost }, mode, devServer, devtool, htmlPluginCard);