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
  { theme: 'normal' },
  {
    block: 'modal',
    didMount: function didMount() {
      this.__base.apply(this, arguments);

      if (this.props.visible) {
        this._onceShown = true;
      }
    },
    willReceiveProps: function willReceiveProps(_ref) {
      var visible = _ref.visible;

      this.__base.apply(this, arguments);

      if (visible) {
        this._onceShown = true;
      }
    },
    mods: function mods() {
      return _extends({}, this.__base.apply(this, arguments), {
        js: this._onceShown ? 'inited' : undefined,
        'has-animation': 'yes',
      });
    },
  },
);
