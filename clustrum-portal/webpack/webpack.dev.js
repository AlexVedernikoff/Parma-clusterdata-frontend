const { generateConfig } = require('./webpack.config-generator');
const { BI_PATH, EXPORT_PATH } = require('./../src/context-path');

const biHost = `${BI_PATH}`;
const portalHost = '';
const exportHost = `${EXPORT_PATH}`;

const env = {
  from: './environment/.env',
};

module.exports = generateConfig(
  { biHost, portalHost, exportHost },
  'production',
  {},
  false,
  env,
  'Кластрум',
);
