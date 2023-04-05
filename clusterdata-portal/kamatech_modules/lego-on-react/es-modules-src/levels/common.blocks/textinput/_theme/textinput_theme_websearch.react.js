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
import '../textinput.react.js';
import '../../../desktop.blocks/textinput/textinput.react.js';
import '../_has-clear/textinput_has-clear_yes.react.js';

export default declMod(
  { theme: 'websearch' },
  {
    block: 'textinput',
    mods: function mods() {
      return _extends({}, this.__base.apply(this, arguments), {
        'has-clear': 'yes',
      });
    },
  },
);
