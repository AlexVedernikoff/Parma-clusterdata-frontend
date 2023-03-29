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

import React from 'react';
import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';
// import "./../__label/tumbler__label.css";
import _tumbler__text from '../__text/tumbler__text.react.js';

var TumblerText = _tumbler__text.applyDecls();

export default decl(
  {
    block: 'tumbler',
    elem: 'label',
    tag: 'span',
    mods: function mods(_ref) {
      var side = _ref.side;
      return {
        side: side,
      };
    },
    attrs: function attrs(_ref2) {
      var side = _ref2.side,
        onChange = _ref2.onChange;
      return _objectSpread({}, this.__base.apply(this, arguments), {
        onClick: this.context.defineLabelAction(side, onChange),
      });
    },
    content: function content(_ref3) {
      var side = _ref3.side,
        id = _ref3.id,
        text = _ref3.text;
      return React.createElement(
        TumblerText,
        {
          id: id,
          side: side,
        },
        text,
      );
    },
  },
  {
    contextTypes: {
      defineLabelAction: PropTypes.func,
    },
  },
);
