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

import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import './__item/menu__item.react.js';
import '../../desktop.blocks/menu/__item/menu__item.react.js';
import './__item/_type/menu__item_type_option.react.js';
import _menu__item_type_link from './__item/_type/menu__item_type_link.react.js';

var MenuItem = _menu__item_type_link.applyDecls();

import _menu__group from './__group/menu__group.react.js';

var MenuGroup = _menu__group.applyDecls();

export default decl(
  {
    block: 'menu',
    willInit: function willInit(_ref) {
      var val = _ref.val;

      this.__base.apply(this, arguments);

      this.state = {
        val: [],
      };

      this._provideClick = this._provideClick.bind(this);

      this.onMouseUp = this.onMouseUp.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);

      this.items = [];

      this._registerItem = this._registerItem.bind(this);
      this._unregisterItem = this._unregisterItem.bind(this);

      this._onChange = this._onChange.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var val = _ref2.val;

      this.__base.apply(this, arguments);

      this.setState({ val: this._prepareVal(val) });
    },
    getChildContext: function getChildContext() {
      return {
        registerItem: this._registerItem,
        unregisterItem: this._unregisterItem,
      };
    },
    attrs: function attrs(_ref3) {
      var tabIndex = _ref3.tabIndex,
        disabled = _ref3.disabled,
        style = _ref3.style;

      return {
        style: style,
        disabled: disabled,
        'aria-disabled': disabled ? 'true' : false,
        // Проверка на disabled гипотетически может сломать select2,
        // где mousedown даже по disabled-меню не должен уводить фокус с кнопки.
        // Однако кейс кажется редким.
        onMouseUp: disabled ? undefined : this.onMouseUp,
        onMouseDown: disabled ? undefined : this.onMouseDown,
        tabIndex: disabled ? undefined : tabIndex === null ? undefined : tabIndex,
      };
    },
    mods: function mods(_ref4) {
      var size = _ref4.size,
        view = _ref4.view,
        theme = _ref4.theme,
        width = _ref4.width,
        disabled = _ref4.disabled;

      return _extends({}, this.__base.apply(this, arguments), {
        size: size,
        width: width,
        theme: theme,
        view: view,
        disabled: bool2string(disabled),
      });
    },
    content: function content(_ref5) {
      var type = _ref5.type,
        size = _ref5.size,
        view = _ref5.view,
        nowrap = _ref5.nowrap,
        items = _ref5.items,
        children = _ref5.children;
      var val = this.state.val;

      var isNavigation = type === 'navigation';
      var needIconGlyph =
        view === 'default' && ['check', 'radio', 'radiocheck'].indexOf(type) !== -1;

      if (items) {
        children = items.map(this.__self.normalizeItem);
      }

      return Children.map(
        children,
        function expand(item, i) {
          if (item === false || item === null || item === undefined) {
            return;
          }

          if (MenuItem.isItem(item)) {
            if (['check', 'radio', 'radiocheck'].indexOf(type) !== -1) {
              item = cloneElement(item, {
                size: size,
                needIconGlyph: needIconGlyph,
                type: 'option',
                key: 'option-' + i,
                checked: val.indexOf(item.props.val) !== -1,
                onClick: item.props.disabled
                  ? undefined
                  : this._provideClick(
                      item.props.val === undefined ? null : item.props.val,
                      item.props.onClick,
                    ),
              });
            } else if (isNavigation) {
              item = cloneElement(item, {
                size: size,
                needIconGlyph: needIconGlyph,
                type: item.props.url ? 'link' : undefined,
                isNavigation: isNavigation,
                key: 'link-' + i,
              });
            } else {
              item = cloneElement(item, {
                onClick: item.props.disabled
                  ? undefined
                  : this._provideClick(
                      item.props.val === undefined ? null : item.props.val,
                      item.props.onClick,
                    ),
              });
            }
          } else if (MenuGroup.isGroup(item)) {
            item = cloneElement(item, {
              isNavigation: isNavigation,
              key: 'group-' + i,
              children: [].concat(item.props.children).map(expand, this),
            });
          } else if (!nowrap) {
            // FIXME
            item = React.createElement(MenuItem, { needIconGlyph: needIconGlyph }, item);
          }

          return item;
        },
        this,
      );
    },
    _provideClick: function _provideClick(value, itemOnClick) {
      var _this = this;

      return function(event) {
        _this.onClick(event, value);
        itemOnClick && itemOnClick(event, value);
      };
    },
    onMouseUp: function onMouseUp(e) {
      this.props.onMouseUp && this.props.onMouseUp(e);
    },
    onMouseDown: function onMouseDown(e) {
      this.props.onMouseDown && this.props.onMouseDown(e);
    },
    onClick: function onClick(e, val) {
      this.props.onClick && this.props.onClick(e, val);
    },
    _onChange: function _onChange(newVal, oldVal) {
      this.props.onChange && this.props.onChange(newVal, oldVal);
    },
    _prepareVal: function _prepareVal(val) {
      return val === undefined ? [] : [].concat(val);
    },
    _registerItem: function _registerItem(item) {
      this.items.push(item);
    },
    _unregisterItem: function _unregisterItem(item) {
      this._hoveredItem === item && (this._hoveredItem = null);
      return this.items.splice(this.items.indexOf(item), 1);
    },
  },
  {
    normalizeItem: _normalizeItem,
    Item: MenuItem,
    Group: MenuGroup,
    propTypes: {
      theme: PropTypes.string.isRequired,
      val: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.number]),
      size: PropTypes.oneOf(['xs', 's', 'm', 'n']),
      type: PropTypes.string,
      nowrap: PropTypes.bool,
      tabIndex: PropTypes.string,
      view: PropTypes.oneOf(['classic', 'default']),
      tone: PropTypes.string,
      onMouseDown: PropTypes.func,
      onMouseUp: PropTypes.func,
      onClick: PropTypes.func,
      onChange: PropTypes.func,
    },
    defaultProps: {
      view: 'classic',
    },
    childContextTypes: {
      registerItem: PropTypes.func,
      unregisterItem: PropTypes.func,
    },
  },
);

function _normalizeItem(item, i) {
  return typeof item === 'string'
    ? _toItem({ text: item }, i)
    : item.items
    ? _toGroup(item)
    : _toItem(item, i);
}

function _toItem(item, i) {
  var disabled = Object(item.elemMods).disabled;
  return React.createElement(
    MenuItem,
    _extends(
      {
        key: 'item-' + i,
        disabled: disabled === 'yes' ? true : disabled,
      },
      item,
    ),
    item.text,
  );
}

function _toGroup(group) {
  return React.createElement(
    MenuGroup,
    { title: group.title },
    group.items.map(_normalizeItem),
  );
}
