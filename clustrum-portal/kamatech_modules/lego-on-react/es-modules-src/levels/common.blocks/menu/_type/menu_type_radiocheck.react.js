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
  { type: 'radiocheck' },
  {
    block: 'menu',
    willInit: function willInit(_ref) {
      var val = _ref.val;

      this.__base.apply(this, arguments);

      this.state.val = val === undefined ? [] : [Array.isArray(val) ? val[0] : val]; // Нам нужен только первый из массива

      this.onClick = this.onClick.bind(this);
    },
    attrs: function attrs(_ref2) {
      var _ref2$tabIndex = _ref2.tabIndex,
        tabIndex = _ref2$tabIndex === undefined ? 0 : _ref2$tabIndex;

      return _extends({}, this.__base.apply(this, arguments), {
        role: 'listbox',
        tabIndex: tabIndex,
      });
    },
    onClick: function onClick(e, val) {
      if (val !== null) {
        var newVal = this._prepareVal(val === this.state.val[0] ? undefined : val);
        var oldVal = this.state.val;

        this.setState({ val: newVal });
        this._onChange(newVal, oldVal);
      }
      this.props.onClick && this.props.onClick(e, val);
    },
  },
);
