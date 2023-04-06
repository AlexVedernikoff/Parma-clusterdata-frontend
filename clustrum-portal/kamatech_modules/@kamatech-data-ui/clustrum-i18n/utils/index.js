class I18N {
  static registerKeysets(data = {}) {
    I18N.data = data;
  }

  static i18n(keyset, key, params) {
    const keyValue = I18N.data[keyset] && I18N.data[keyset][key];
    let result;

    if (typeof keyValue === 'undefined') {
      console.warn('No value for i18n key:', keyset, key);

      return key;
    }

    if (params) {
      const count = Number(params.count);

      if (Array.isArray(keyValue)) {
        if (typeof count !== 'number') {
          console.warn('No params.count for i18n key:', keyset, key);

          return key;
        }

        const lastNumber = count % 10;
        const lastNumbers = count % 100;
        let index;

        if (count === 0) {
          index = 3;
        } else if (lastNumber === 1 && lastNumbers !== 11) {
          index = 0;
        } else if (lastNumber > 1 && lastNumber < 5 && (lastNumbers < 10 || lastNumbers > 20)) {
          index = 1;
        } else {
          index = 2;
        }

        result = keyValue[index];
      } else {
        result = keyValue;
      }

      Object.keys(params).forEach(param => {
        result = (result || '').replace(new RegExp(`({{${param}}})`, 'g'), params[param]);
      });
    } else {
      result = keyValue;
    }

    return result;
  }

  static keyset(keysetName) {
    return (...args) => {
      return I18N.i18n(keysetName, ...args);
    };
  }
}

I18N.data = {};

module.exports = {
  I18n: I18N,
  i18n: I18N.i18n,
};
