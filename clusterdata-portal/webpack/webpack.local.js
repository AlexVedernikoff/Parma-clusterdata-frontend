const { generateConfig } = require('./webpack.config-base');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BI_PATH, EXPORT_PATH } = require('./../src/context-path');

const biHost = `http://127.0.0.1:8092${ BI_PATH }`;
const portalHost = 'http://localhost:8090';
const exportHost = `http://localhost:8096${ EXPORT_PATH }`;

const mode = 'development';
const devServer = {
  historyApiFallback: true,
  port: 8090,
};
const devtool = 'inline-source-map';
const envOption = { from: './environment/.env' };
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
  exportHost,
  hash: true,
});

module.exports = generateConfig({ biHost, portalHost, exportHost }, mode, devServer, devtool, htmlPluginCard, envOption);