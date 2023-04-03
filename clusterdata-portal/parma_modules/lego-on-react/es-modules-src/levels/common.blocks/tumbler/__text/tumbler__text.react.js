function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';
export default decl(
  {
    block: 'tumbler',
    elem: 'text',
    tag: 'span',
    mods: function mods(_ref) {
      var side = _ref.side;
      return {
        side: side,
      };
    },
    attrs: function attrs(_ref2) {
      var id = _ref2.id;
      return _objectSpread({}, this.__base.apply(this, arguments), {
        'aria-hidden': 'true',
        id: id,
      });
    },
  },
  {
    propTypes: {
      id: PropTypes.string,
    },
  },
);
