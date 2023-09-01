const { generateConfig } = require('./webpack.config-generator');
const { BI_PATH, EXPORT_PATH } = require('./../src/context-path');

const biHost = `http://localhost:8090${BI_PATH}`;
const portalHost = 'http://localhost:8090';
const exportHost = `http://localhost:8096${EXPORT_PATH}`;

const devServer = {
  historyApiFallback: true,
  port: 8090,
};

const env = {
  from: './environment/.env.local-front',
  to: '.env',
  toType: 'file',
};

module.exports = generateConfig(
  { biHost, portalHost, exportHost },
  'development',
  devServer,
  'inline-source-map',
  env,
  'Кластрум',
);
