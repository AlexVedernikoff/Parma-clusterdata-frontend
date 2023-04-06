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
  { width: 'fixed' },
  {
    block: 'select2',
    didMount: function didMount() {
      this.__base.apply(this, arguments);

      this.setState({ width: this._getAnchorWidth() });
    },
    _getButtonProps: function _getButtonProps() {
      return _extends({}, this.__base.apply(this, arguments), {
        style: { width: this.state.width + 'px' },
      });
    },
  },
);
