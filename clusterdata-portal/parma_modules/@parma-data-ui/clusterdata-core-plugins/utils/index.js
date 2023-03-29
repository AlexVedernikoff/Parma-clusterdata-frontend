'use strict';

const { DEFAULT_TIMEOUT, TRUE_FLAGS } = require('../constants');

const DEFAULT_CONFIG = {
  responseType: 'json',
  timeout: DEFAULT_TIMEOUT,
};

class Utils {
  static getNameByIndex({ path, index }) {
    let name = '/';

    if (path && typeof path === 'string') {
      let pathSplit = path.split('/');
      pathSplit = pathSplit.filter(Boolean);

      if (pathSplit.length !== 0) {
        name = pathSplit.splice(index, 1)[0];
      }
    }

    return name;
  }

  static normalizeDestination(destination = '') {
    // Отрываем крайние слэши, и добавляем один справа
    return destination.replace(/^\/+|\/+$/g, '') + '/';
  }

  static applyDefaultConfig(handle) {
    return (...args) => {
      const requestConfig = handle(...args);

      return {
        ...DEFAULT_CONFIG,
        ...requestConfig,
      };
    };
  }

  static flattenSchema(schema, initialFlattenedSchema = {}) {
    return Object.entries(schema).reduce((flattenedSchema, [key, handle]) => {
      if (typeof handle === 'function') {
        if (flattenedSchema[key]) {
          throw new Error('The same function name already is used');
        } else {
          flattenedSchema[key] = Utils.applyDefaultConfig(handle);
        }
      } else if (typeof handle === 'object') {
        Utils.flattenSchema(handle, flattenedSchema);
      }

      return flattenedSchema;
    }, initialFlattenedSchema);
  }

  static isTrueArg(arg) {
    return TRUE_FLAGS.includes(arg);
  }
}

module.exports = Utils;
