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

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import _select2__button from './__button/select2__button.react.js';

var SelectButton = _select2__button.applyDecls();

//import "./__button/select2__button.css";
import _select2__popup from './__popup/select2__popup.react.js';

var SelectPopup = _select2__popup.applyDecls();

import _select2__control from './__control/select2__control.react.js';

var SelectControl = _select2__control.applyDecls();

//import "./__control/select2__control.css";
import '../menu/menu.react.js';
import _menu from '../../desktop.blocks/menu/menu.react.js';

var Menu = _menu.applyDecls();

//import "./../menu/menu.css";
import '../menu/__item/menu__item.react.js';
import '../../desktop.blocks/menu/__item/menu__item.react.js';
import _menu__item_type_option from '../menu/__item/_type/menu__item_type_option.react.js';

var MenuItem = _menu__item_type_option.applyDecls();

import _menu__group from '../menu/__group/menu__group.react.js';

var MenuGroup = _menu__group.applyDecls();

export default decl(
  {
    block: 'select2',
    tag: 'span',
    willInit: function willInit(_ref) {
      var val = _ref.val;

      this._initialVal = val;
      this.state = {
        val: (val = this._prepareVal(val)),
        opened: false,
      };

      this._setAnchor = this._setAnchor.bind(this);
      this._getAnchorWidth = this._getAnchorWidth.bind(this);

      this._onButtonClick = this._onButtonClick.bind(this);
      this._onButtonBlur = this._onButtonBlur.bind(this);

      this._onOutsideClick = this._onOutsideClick.bind(this);
      this._onMenuClick = this._onMenuClick.bind(this);

      this._onMenuChange = this._onMenuChange.bind(this);

      this._onMenuMouseUp = this._onMenuMouseUp.bind(this);
      this._onMenuMouseDown = this._onMenuMouseDown.bind(this);

      this._onChange = this._onChange.bind(this);
      this._onWinRotateAndResize = this._onWinRotateAndResize.bind(this);

      this._preventBlur = null;

      this._getMenu = this._getMenu.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var val = _ref2.val;

      this.__base.apply(this, arguments);
      this.setState({ val: this._prepareVal(val) });
    },
    willUpdate: function willUpdate(nextProps, nextState) {
      if (nextState.opened === true) {
        window.addEventListener('resize', this._onWinRotateAndResize);
        window.addEventListener('orientationchange', this._onWinRotateAndResize);
      } else {
        window.removeEventListener('resize', this._onWinRotateAndResize);
        window.removeEventListener('orientationchange', this._onWinRotateAndResize);
      }
    },
    willUnmount: function willUnmount() {
      window.removeEventListener('resize', this._onWinRotateAndResize);
      window.removeEventListener('orientationchange', this._onWinRotateAndResize);
    },
    getChildContext: function getChildContext() {
      return {
        getMenu: this._getMenu,
      };
    },
    mods: function mods(_ref3) {
      var theme = _ref3.theme,
        size = _ref3.size,
        width = _ref3.width,
        disabled = _ref3.disabled,
        type = _ref3.type,
        text = _ref3.text,
        view = _ref3.view,
        baseline = _ref3.baseline;
      var opened = this.state.opened;

      return {
        theme: theme,
        size: size,
        view: view,
        width: width,
        disabled: disabled,
        type: type,
        baseline: bool2string(baseline),
        opened: bool2string(opened),
        text: text === undefined && width !== 'fixed' ? 'vary' : text,
      };
    },
    content: function content(_ref4) {
      var theme = _ref4.theme,
        size = _ref4.size,
        type = _ref4.type,
        text = _ref4.text,
        view = _ref4.view,
        tone = _ref4.tone,
        placeholder = _ref4.placeholder,
        name = _ref4.name,
        maxHeight = _ref4.maxHeight,
        optionsMaxHeight = _ref4.optionsMaxHeight,
        control = _ref4.control,
        width = _ref4.width,
        disabled = _ref4.disabled,
        itemIconHidden = _ref4.itemIconHidden,
        items = _ref4.items,
        children = _ref4.children,
        zIndexGroupLevel = _ref4.zIndexGroupLevel,
        _ref4$button = _ref4.button,
        buttonProps = _ref4$button === undefined ? {} : _ref4$button,
        _ref4$menu = _ref4.menu,
        menuProps = _ref4$menu === undefined ? {} : _ref4$menu,
        _ref4$popup = _ref4.popup,
        popupProps = _ref4$popup === undefined ? {} : _ref4$popup;
      var _state = this.state,
        val = _state.val,
        opened = _state.opened;

      var vals = [];
      var flattenItems = [];

      // consistency
      maxHeight = optionsMaxHeight || maxHeight;

      if (items) {
        children = items.map(Menu.normalizeItem);
      }

      // Нормализуем, извлекаем значения.
      Children.forEach(children, function fn(item) {
        if (MenuGroup.isGroup(item) && item.props.children) {
          [].concat(item.props.children).forEach(fn);
        } else if (MenuItem.isItem(item)) {
          flattenItems.push(item);
          vals.push(item.props.val);
        }
      });

      // Приводим val к массиву, чтобы потом не думать о формате.
      // Удаляем значения, которых нет в children.
      val =
        val === undefined
          ? []
          : [].concat(val).filter(function(val) {
              return vals.indexOf(val) !== -1;
            });

      // У этих типов может быть максимум один выбранный item.
      if (['radio', 'radiocheck'].indexOf(type) !== -1 && val.length > 1) {
        val = val.slice(-1);
      }

      // DEPRECATED, в следующей мажорной версии перестанет проставляться по умолчанию.
      // Тем, кто проставлял до этого ширину fixed, модификатор по умолчанию не нужен.
      if (text === undefined && width !== 'fixed') {
        /*%%%ISLDEBUG%%%*/ +0 &&
          console.error(
            'В следующей мажорной версии значение vary для поля text ' +
              'перестанет проставляться по умолчанию, пожалуйста, ' +
              'при необходимости передавайте значение явно.',
          );

        text = 'vary';
      }

      placeholder =
        text !== 'vary' || !val.length
          ? placeholder
          : flattenItems
              .reduce(function(res, item) {
                val.indexOf(item.props.val) !== -1 &&
                  res.push(item.props.checkedText || item.props.children);
                return res;
              }, [])
              .join(', ');

      var checked = Boolean(val.length && ['check', 'radiocheck'].indexOf(type) !== -1);

      return [
        React.createElement(
          SelectButton,
          _extends(
            { key: 'button' },
            {
              val: val,
              tone: tone,
              view: view,
              opened: opened,
              placeholder: placeholder,
              items: flattenItems,
              setAnchor: this._setAnchor,
              multiselectable: type === 'check',
              buttonProps: this._getButtonProps(buttonProps, {
                theme: theme,
                size: size,
                disabled: disabled,
                checked: checked,
                onClick: this._onButtonClick,
                onBlur: this._onButtonBlur,
              }),
            },
          ),
        ),
        control &&
          React.createElement(SelectControl, {
            val: val,
            name: name,
            disabled: disabled,
            key: 'control',
            items: flattenItems,
            multiple: type !== 'radio',
          }),
        React.createElement(
          SelectPopup,
          _extends(
            { key: 'popup' },
            {
              maxHeight: maxHeight,
              items: children,
              itemIconHidden: itemIconHidden,
              setAnchor: this._setAnchor,
              getAnchorWidth: this._getAnchorWidth,
              zIndexGroupLevel: zIndexGroupLevel,
              menuProps: this._getMenuProps(menuProps, {
                theme: 'normal',
                size: size,
                type: type,
                view: view,
                tone: tone,
                val: val,
                onClick: this._onMenuClick,
                onChange: this._onMenuChange,
                onMouseUp: this._onMenuMouseUp,
                onMouseDown: this._onMenuMouseDown,
              }),
              popupProps: this._getPopupProps(popupProps, {
                tone: tone,
                view: view,
                theme: 'normal',
                visible: opened,
                onOutsideClick: this._onOutsideClick,
              }),
            },
          ),
        ),
      ];
    },
    reset: function reset() {
      this.setState({
        val: this._prepareVal(this._initialVal),
      });
    },
    _setAnchor: function _setAnchor(a) {
      if (a === undefined) {
        return this._anchorDom;
      }

      this._anchorDom = a;
    },
    _getAnchorRect: function _getAnchorRect() {
      return this._anchorDom.getBoundingClientRect();
    },
    _getAnchorWidth: function _getAnchorWidth() {
      return Math.round(this._getAnchorRect().width);
    },
    _getMenu: function _getMenu(menu) {
      if (menu === undefined) {
        return this._menu;
      }
      this._menu = menu;
    },

    // Дает возможность подключать select без типа.
    _onMenuClick: function _onMenuClick(e, val) {
      this._onButtonClick(e);
    },
    _onMenuChange: function _onMenuChange(newVal, oldVal) {
      this.setState({
        val: newVal,
        opened: false,
      });

      this._onChange(newVal);
    },
    _onMenuMouseUp: function _onMenuMouseUp(e) {
      this._anchorDom.focus();
    },
    _onMenuMouseDown: function _onMenuMouseDown(e) {
      this._preventBlur = true;
    },
    _onButtonBlur: function _onButtonBlur() {
      if (this._preventBlur) {
        this._preventBlur = null;
        return;
      }

      this.setState({ opened: false });
    },
    _onButtonClick: function _onButtonClick(e) {
      this.setState({ opened: !this.state.opened });
    },

    _onOutsideClick: function _onOutsideClick(e) {
      this.setState({ opened: false });
    },
    _onChange: function _onChange(val) {
      this.props.onChange && this.props.onChange(val);
    },
    _overridableProps: function _overridableProps(base, extend) {
      return _extends({}, base, extend);
    },
    _getButtonProps: function _getButtonProps() {
      return this._overridableProps.apply(this, arguments);
    },
    _getPopupProps: function _getPopupProps() {
      var style = {};
      if (this.state.opened === true) {
        style.minWidth = this._getAnchorWidth() + 'px';
      }

      return _extends(
        {
          style: style,
        },
        this._overridableProps.apply(this, arguments),
      );
    },
    _getMenuProps: function _getMenuProps() {
      return this._overridableProps.apply(this, arguments);
    },
    _prepareVal: function _prepareVal(val) {
      return val === undefined ? [] : [].concat(val);
    },
    _onWinRotateAndResize: function _onWinRotateAndResize() {
      this.setState({ opened: false });
    },
  },
  {
    propTypes: {
      baseline: PropTypes.bool,
      theme: PropTypes.string.isRequired,
      tone: PropTypes.string,
      view: PropTypes.oneOf(['classic', 'default']),
      text: PropTypes.string,
      name: PropTypes.string,
      control: PropTypes.bool,
      type: PropTypes.oneOf(['radio', 'check', 'radiocheck']),
      size: PropTypes.oneOf(['xs', 's', 'm', 'n']),
      width: PropTypes.oneOf(['fixed', 'max']),
      zIndexGroupLevel: PropTypes.number,
      onChange: PropTypes.func,
    },
    defaultProps: {
      view: 'classic',
      placeholder: '—',
      maxHeight: Number.POSITIVE_INFINITY,
    },
    childContextTypes: {
      getMenu: PropTypes.func,
    },
    Item: MenuItem,
    Group: MenuGroup,
  },
);
