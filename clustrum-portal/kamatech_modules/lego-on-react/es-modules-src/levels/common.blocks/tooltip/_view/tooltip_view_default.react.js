var _extends =
  Object.assign ||
  function(target) {
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
import { declMod, bool2string } from '@kamatech-lego/i-bem-react';

export default declMod(
  { view: 'default' },
  {
    block: 'tooltip',
    mods: function mods(_ref) {
      var tone = _ref.tone,
        pulsingTail = _ref.pulsingTail;

      return _extends({}, this.__base.apply(this, arguments), {
        tone: tone,
        'pulsing-tail': bool2string(pulsingTail),
      });
    },
  },
  {
    propTypes: {
      tone: PropTypes.string,
      pulsingTail: PropTypes.bool,
    },
    defaultProps: {
      tone: 'default',
      size: 'n',
    },
  },
);
