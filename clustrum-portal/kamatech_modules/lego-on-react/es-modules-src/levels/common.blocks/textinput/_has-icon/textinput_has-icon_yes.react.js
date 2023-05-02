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
import PropTypes from 'prop-types';
import { declMod, bool2string } from '@kamatech-lego/i-bem-react';
import _textinput__icon from '../__icon/textinput__icon.react.js';

var TextInputIcon = _textinput__icon.applyDecls();

//import "./../__icon/textinput__icon.css";
//import "./../__icon/_side/textinput__icon_side_left.css";
//import "./../__icon/_side/textinput__icon_side_right.css";

export default declMod(
  function(_ref) {
    var iconLeft = _ref.iconLeft,
      iconRight = _ref.iconRight,
      icon = _ref.icon;
    return iconLeft || iconRight || icon;
  },
  {
    block: 'textinput',
    mods: function mods(_ref2) {
      var iconLeft = _ref2.iconLeft,
        iconRight = _ref2.iconRight,
        icon = _ref2.icon;

      return _extends({}, this.__base.apply(this, arguments), {
        'has-icon': bool2string(iconLeft || iconRight || icon),
      });
    },
    content: function content(_ref3) {
      var iconLeft = _ref3.iconLeft,
        iconRight = _ref3.iconRight,
        icon = _ref3.icon;

      var content = [];

      (icon || iconLeft) &&
        content.push(React.createElement(TextInputIcon, { side: 'left', key: 'left' }, iconLeft || icon));
      iconRight && content.push(React.createElement(TextInputIcon, { side: 'right', key: 'right' }, iconRight));

      return [].concat(content, this.__base.apply(this, arguments));
    },
  },
  {
    propTypes: {
      iconLeft: PropTypes.object,
      iconRight: PropTypes.object,
    },
  },
);
