import ErrorDispatcher, { ERROR_TYPE } from '../error-dispatcher/error-dispatcher';

const EXTENSION_KEY = {
  HOLIDAYS: 'holidays',
};

const extensions = {};

class ExtensionsManager {
  static add(key, value) {
    extensions[key] = value;
  }

  static get(key) {
    if (extensions[key]) {
      return extensions[key];
    }
    throw ErrorDispatcher.wrap({ type: ERROR_TYPE.UNKNOWN_EXTENSION, extra: { key } });
  }

  static has(key) {
    return Boolean(extensions[key]);
  }
}

export default ExtensionsManager;

export { EXTENSION_KEY };
