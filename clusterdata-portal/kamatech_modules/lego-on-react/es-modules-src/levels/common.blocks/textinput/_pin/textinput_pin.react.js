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

import { declMod } from '@parma-lego/i-bem-react';
import '../textinput.react.js';
import '../../../desktop.blocks/textinput/textinput.react.js';
// import "./../_has-pin/textinput_has-pin_yes.css";

export default declMod(
  function(props) {
    return props.pin;
  },
  {
    block: 'textinput',
    mods: function mods() {
      return _extends({}, this.__base.apply(this, arguments), {
        'has-pin': 'yes',
      });
    },
  },
);
