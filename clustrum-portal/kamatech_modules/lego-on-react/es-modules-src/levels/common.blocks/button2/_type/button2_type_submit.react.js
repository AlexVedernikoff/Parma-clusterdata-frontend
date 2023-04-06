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

import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { type: 'submit' },
  {
    block: 'button2',
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        type: 'submit',
      });
    },
  },
);
