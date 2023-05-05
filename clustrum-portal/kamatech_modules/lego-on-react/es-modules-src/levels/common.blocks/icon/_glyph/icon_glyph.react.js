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
  { glyph: '*' },
  {
    block: 'icon',
    mods: function mods() {
      return _extends({}, this.__base.apply(this, arguments), { 'has-glyph': 'yes' });
    },
  },
);
