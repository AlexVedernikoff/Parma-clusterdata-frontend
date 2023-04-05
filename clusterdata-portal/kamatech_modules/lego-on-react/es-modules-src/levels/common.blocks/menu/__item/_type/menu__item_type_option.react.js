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

import { declMod, bool2string } from '@kamatech-lego/i-bem-react';

export default declMod(
  { type: 'option' },
  {
    block: 'menu',
    elem: 'item',
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        role: 'option',
      });
    },
    mods: function mods(_ref) {
      var checked = _ref.checked;

      return _extends({}, this.__base.apply(this, arguments), {
        checked: bool2string(checked),
      });
    },
  },
);
