'use strict';

const Utils = require('../../utils');
const GENERAL_API_SCHEMA = require('./general');
const BI_API_SCHEMA = require('./bi');

const SCHEMA_API = {
  ...GENERAL_API_SCHEMA,
  bi: {
    ...BI_API_SCHEMA,
  },
};

module.exports = {
  schema: SCHEMA_API,
  schemaApi: Utils.flattenSchema(SCHEMA_API),
};
