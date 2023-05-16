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

import React from 'react';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../../control/control.react.js';
import _control from '../../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _icon from '../../icon/icon.react.js';

var Icon = _icon.applyDecls();

/*
import "./../../icon/icon.css";
import "./../../icon/_type/icon_type_cross.css";
*/

export default decl(Control, {
  block: 'textarea',
  elem: 'clear',
  mods: function mods(_ref) {
    var theme = _ref.theme,
      visible = _ref.visible;

    return _extends({}, this.__base.apply(this, arguments), {
      theme: theme,
      visible: bool2string(visible),
    });
  },
  render: function render() {
    var block = this.block,
      elem = this.elem;

    return React.createElement(Icon, {
      type: 'cross',
      attrs: this.attrs(this.props),
      mix: { block: block, elem: elem, mods: this.mods(this.props) },
    });
  },
});
