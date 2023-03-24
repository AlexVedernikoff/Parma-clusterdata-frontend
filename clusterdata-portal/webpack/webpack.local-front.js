const { generateConfig } = require('./webpack.config-base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BI_PATH, EXPORT_PATH } = require('./../src/context-path');

const biHost = `http://clusterdata-web.parmalogica.ru${ BI_PATH }`;
const portalHost = 'http://localhost:8090';
const exportHost = `http://localhost:8096${ EXPORT_PATH }`;

const mode = 'development';
const devServer = {
  historyApiFallback: true,
  port: 8090,
};
const devtool = 'inline-source-map';
const htmlPluginCard = new HtmlWebpackPlugin({
  filename: 'card.html',
  template: './src/card.html',
  chunks: ['vendors', 'commons', 'app', 'card'],
  component: 'card',
  templateParameters: {
    dotenv: '<%- dotenv %>',
  },
  biHost,
  portalHost,
  exportHost,
  hash: true,
});

module.exports = generateConfig({ biHost, portalHost, exportHost }, mode, devServer, devtool, htmlPluginCard);