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
import { decl } from '@kamatech-lego/i-bem-react';
import { findDOMNode } from 'react-dom';
import '../../control/control.react.js';
import _control from '../../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import '../../icon/icon.react.js';
import '../../icon/_glyph/icon_glyph.react.js';
import _icon_glyph_typeCheck from '../../icon/_glyph/icon_glyph_type-check.react.js';

var Icon = _icon_glyph_typeCheck.applyDecls();

// import "./../../icon/icon.css";
// import "./../../icon/_glyph/icon_glyph.css";
// import "./../../icon/_glyph/icon_glyph_type-check.css";
import _menu__icon from '../__icon/menu__icon.react.js';

var MenuIcon = _menu__icon.applyDecls();

import _menu__text from '../__text/menu__text.react.js';

var MenuText = _menu__text.applyDecls();

import _menu__listItem from '../__list-item/menu__list-item.react.js';

var MenuListItem = _menu__listItem.applyDecls();

export default decl(
  Control,
  {
    block: 'menu',
    elem: 'item',
    didMount: function didMount() {
      this.context.registerItem(this);
    },
    willUnmount: function willUnmount() {
      this.context.unregisterItem(this);
    },
    attrs: function attrs(_ref) {
      var title = _ref.title;
      var _state = this.state,
        disabled = _state.disabled,
        checked = _state.checked;

      return _extends({}, this.__base.apply(this, arguments), {
        title: title,
        'aria-selected': checked ? 'true' : false,
        'aria-disabled': disabled ? 'true' : false,
      });
    },

    // FIXME: оторвать после релиза bem-react-core@1.0.0,
    // знаем чиним :(
    // https://github.com/bem/bem-react-core/issues/206
    mods: function mods() {
      return this.__base.apply(this, arguments);
    },
    render: function render() {
      var isNavigation = this.props.isNavigation;

      if (isNavigation) {
        return React.createElement(
          MenuListItem,
          null,
          this.__base.apply(this, arguments),
        );
      }
      return this.__base.apply(this, arguments);
    },
    content: function content(_ref2) {
      var size = _ref2.size,
        icon = _ref2.icon,
        children = _ref2.children,
        needIconGlyph = _ref2.needIconGlyph;

      var content = [];
      (icon ? [icon] : []).concat(children).forEach(function(child, i) {
        if (Icon.isIcon(child) && i === 0) {
          content.push(
            React.createElement(
              MenuIcon,
              _extends({ size: size, key: 'icon' }, { mix: child.props.mix }),
              child,
            ),
          );
        } else {
          content.push(React.createElement(MenuText, { key: 'text-' + i }, child));
        }
      });

      needIconGlyph &&
        content.unshift(
          React.createElement(Icon, { key: 'check-icon', glyph: 'type-check' }),
        );

      return content;
    },
    getText: function getText() {
      return findDOMNode(this).textContent.trim();
    },
  },
  {
    isItem: function isItem(child) {
      return (
        child &&
        typeof child.type === 'function' &&
        child.type.displayName === 'menu__item'
      );
    },
    propTypes: {
      title: PropTypes.string,
      onClick: PropTypes.func,
    },
    contextTypes: {
      registerItem: PropTypes.func,
      unregisterItem: PropTypes.func,
    },
  },
);
