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

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../../menu/__item/menu__item.react.js';
import '../../../desktop.blocks/menu/__item/menu__item.react.js';
import _menu__item_type_link from '../../menu/__item/_type/menu__item_type_link.react.js';

var MenuItem = _menu__item_type_link.applyDecls();

export default decl(
  MenuItem,
  {
    block: 'user2',
    elem: 'menu-item',
    mix: function mix(_ref) {
      var action = _ref.action;

      return [].concat(_toConsumableArray(this.__base.apply(this, arguments) || []), [
        {
          block: 'menu',
          elem: 'item',
          mods: { type: 'link', hovered: bool2string(this.state.hovered) },
        },
      ]);
    },
    attrs: function attrs(_ref2) {
      var onClick = _ref2.onClick,
        url = _ref2.url;

      return _extends({}, this.__base.apply(this, arguments), {
        onClick: onClick,
        href: url,
        tabIndex: 0,
      });
    },
    content: function content(_ref3) {
      var text = _ref3.text;

      return text;
    },
  },
  {
    propTypes: {
      action: PropTypes.string,
      type: PropTypes.string,
      isNavigation: PropTypes.bool,
      onClick: PropTypes.func,
      url: PropTypes.string,
      text: PropTypes.string,
    },
    defaultProps: {
      type: 'link',
      isNavigation: true,
      onClick: function onClick() {},
      url: null,
      text: null,
    },
  },
);
