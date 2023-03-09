function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import PropTypes from 'prop-types';
import { declMod } from '@parma-lego/i-bem-react';
export default declMod({
  view: 'default'
}, {
  block: 'tumbler',
  mods: function mods(_ref) {
    var tone = _ref.tone;
    return _objectSpread({}, this.__base.apply(this, arguments), {
      tone: tone
    });
  }
}, {
  propTypes: {
    tone: PropTypes.string
  },
  defaultProps: {
    tone: 'default'
  }
});