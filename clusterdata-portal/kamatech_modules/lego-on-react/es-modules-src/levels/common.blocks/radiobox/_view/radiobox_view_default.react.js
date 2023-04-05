var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

import PropTypes from 'prop-types';
import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { view: 'default' },
  {
    block: 'radiobox',
    mods: function mods(_ref) {
      var tone = _ref.tone;

      return _extends({}, this.__base.apply(this, arguments), {
        tone: tone,
      });
    },
  },
  {
    propTypes: {
      tone: PropTypes.oneOf(['default', 'red', 'grey', 'dark']),
    },
    defaultProps: {
      tone: 'default',
    },
  },
);
