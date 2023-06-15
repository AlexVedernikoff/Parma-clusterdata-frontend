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
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true,
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

import React from 'react';
import Bem, { decl } from '@kamatech-lego/i-bem-react';
// import "./../__sticker-label/tumbler__sticker-label.css";
export default decl({
  block: 'tumbler',
  elem: 'sticker',
  mods: function mods(_ref) {
    var position = _ref.position;
    return {
      position: position,
    };
  },
  attrs: function attrs() {
    return _objectSpread({}, this.__base.apply(this, arguments), {
      'aria-hidden': 'true',
    });
  },
  content: function content(_ref2) {
    var children = _ref2.children;
    return React.createElement(
      Bem,
      {
        block: this.block,
        elem: 'sticker-label',
      },
      children,
    );
  },
});
