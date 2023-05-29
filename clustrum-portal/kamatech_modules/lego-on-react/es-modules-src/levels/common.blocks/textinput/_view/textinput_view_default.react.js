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

import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { view: 'default' },
  {
    block: 'textinput',
    mods: function mods(_ref) {
      var tone = _ref.tone,
        size = _ref.size;

      return _extends({}, this.__base.apply(this, arguments), {
        tone: tone,
        // Если проставить size в defaultProps, это применится и к textinput без модификатора.
        size: size || 'n',
      });
    },
  },
);
