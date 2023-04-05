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

import { decl } from '@kamatech-lego/i-bem-react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import _keycodes from '../../common.blocks/keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

export default decl(
  {
    block: 'menu',
    willInit: function willInit(_ref) {
      var val = _ref.val;

      this.__base.apply(this, arguments);

      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyPress = this.onKeyPress.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);

      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);

      this.hoverItem = this.hoverItem.bind(this);
      this.removeHover = this.removeHover.bind(this);

      this.scrollToItem = this.scrollToItem.bind(this);

      this._isNav = this._isNav.bind(this);
    },
    getChildContext: function getChildContext() {
      return _extends({}, this.__base.apply(this, arguments), {
        hoverItem: this.hoverItem,
        removeHover: this.removeHover,
      });
    },
    attrs: function attrs(_ref2) {
      var disabled = _ref2.disabled;

      return _extends(
        {
          onFocus: disabled ? undefined : this.onFocus,
          onBlur: disabled ? undefined : this.onBlur,
          onKeyDown: disabled ? undefined : this.onKeyDown,
          onKeyPress: disabled ? undefined : this.onKeyPress,
          onKeyUp: disabled ? undefined : this.onKeyUp,
        },
        this.__base.apply(this, arguments),
      );
    },
    onFocus: function onFocus(e) {
      if (!this._hoveredItem && this.items[0] && !this._isNav()) {
        this.hoverItem(this.items[0]);
        this.scrollToItem(this._hoveredItem);
      }

      this.props.onFocus && this.props.onFocus(e);
    },
    onBlur: function onBlur(e) {
      this.removeHover();
      this.props.onBlur && this.props.onBlur(e);
    },
    onKeyDown: function onKeyDown(e) {
      // По ссылочному меню навигация нажатием на Tab.
      if (this._isNav()) {
        return false;
      }

      var keycode = e.keyCode;

      if (Keys.is(keycode, 'SPACE')) {
        e.preventDefault();
      }

      if (Keys.is(keycode, 'UP', 'DOWN')) {
        e.preventDefault();

        this.hoverNext(Keys.is(keycode, 'UP'));
        this._dropSearchCache();
      }
    },
    onKeyUp: function onKeyUp(e) {
      if (Keys.is(e.keyCode, 'ENTER', 'SPACE')) {
        var hoveredItem = this._hoveredItem;

        if (!hoveredItem) {
          return;
        }
        var val = hoveredItem.props.val === undefined ? null : hoveredItem.props.val;
        hoveredItem.props.onClick && hoveredItem.props.onClick(e, val);
      }
    },
    onKeyPress: function onKeyPress(e) {
      var currTime = Number(new Date()),
        charCode = e.charCode,
        chr = String.fromCharCode(charCode).toLowerCase(),
        isSameChar = chr === this._lastChar && this._searchTerm.length === 1,
        hoveredItem = this._hoveredItem,
        items = this.items,
        index = items.indexOf(hoveredItem);

      // Через charCode <= SPACE отсекаем такие "символы" как ENTER, SPACE, ESC и т.д.
      if (charCode <= Keys.SPACE || e.ctrlKey || e.altKey || e.metaKey) {
        this._lastTime = currTime;
        return;
      }

      if (currTime - this._lastTime > this.SEARCH_TIMEOUT || isSameChar) {
        this._searchTerm = chr;
      } else {
        this._searchTerm = (this._searchTerm || '') + chr;
      }

      this._lastChar = chr;
      this._lastTime = currTime;

      index = index >= 0 ? index : 0;

      var itemText = hoveredItem ? hoveredItem.getText() : '';

      // Если клавиша нажата ещё раз и мы стоит на той же опции, продолжаем поиск со следующей.
      if (isSameChar && this._normalizeText(itemText).indexOf(this._searchTerm) === 0) {
        index = index >= items.length - 1 ? 0 : index + 1;
      }

      this.hoverText(this._searchTerm, index);
    },
    hoverItem: function hoverItem(item) {
      if (this._hoveredItem !== item) {
        this._hoveredItem &&
          this._hoveredItem.setState({
            hovered: false,
          });

        !item.props.disabled &&
          item.setState({
            hovered: true,
          });

        this._hoveredItem = item;
      }
    },
    removeHover: function removeHover() {
      if (!this._hoveredItem) {
        return;
      }

      this._hoveredItem.setState({
        hovered: false,
      });

      this._hoveredItem = null;
    },
    hoverNext: function hoverNext(reverse) {
      // Предполагается, что hovered есть всегда:
      // метод вызывается из onKeyDown, т.е. после установки фокуса,
      // при котором появляется hovered.
      var items = this.items.slice();
      var nextItem = void 0;

      items = reverse ? items.reverse() : items;

      for (var i = 0, takeNext = false, item; (item = items[i]); i++) {
        if (item.props.disabled) {
          continue;
        }
        if (item.state.hovered) {
          takeNext = true;
          continue;
        }
        if (takeNext) {
          nextItem = item;
          break;
        }
        if (!nextItem) {
          nextItem = item;
        }
      }

      if (nextItem) {
        this.removeHover();
        this.hoverItem(nextItem);
        this.scrollToItem(nextItem);
      }
    },
    hoverText: function hoverText(str, pos) {
      if (!this.items.length) {
        return;
      }

      var items = this.items;
      var term = this._normalizeText(str);

      var len = items.length;
      var i = pos || 0;
      var item = void 0;

      // Два прохода: от pos до items.length и от 0 до pos.
      while (i < len) {
        item = items[i];

        if (!item.props.disabled && this._normalizeText(item.getText()).indexOf(term) === 0) {
          this.removeHover();
          this.hoverItem(item);
          this.scrollToItem(item);
          return;
        }

        i++;

        if (i === items.length) {
          i = 0;
          len = pos;
        }
      }
    },
    scrollToItem: function scrollToItem(item) {
      var itemDOMNode = findDOMNode(item);
      var menuDOMNode = findDOMNode(this);
      var menuOffsetTop = menuDOMNode.getBoundingClientRect().top;
      var itemOffsetTop = itemDOMNode.getBoundingClientRect().top;

      var relativeScroll = 0;

      if (itemOffsetTop < menuOffsetTop) {
        relativeScroll = itemOffsetTop - menuOffsetTop;
      } else {
        relativeScroll = itemOffsetTop + itemDOMNode.offsetHeight - menuOffsetTop - menuDOMNode.offsetHeight;

        relativeScroll < 0 && (relativeScroll = 0);
      }

      menuDOMNode.scrollTop = menuDOMNode.scrollTop + relativeScroll;
    },
    _normalizeText: function _normalizeText(str) {
      return (str || '').toLowerCase().replace(/ё/, 'е');
    },

    _dropSearchCache: function _dropSearchCache() {
      this._lastTime = this._lastChar = this._searchTerm = undefined;
    },

    _isNav: function _isNav() {
      return this.props.type === 'navigation';
    },

    SEARCH_TIMEOUT: 1500,
  },
  {
    childContextTypes: {
      hoverItem: PropTypes.func,
      removeHover: PropTypes.func,
      registerItem: PropTypes.func,
      unregisterItem: PropTypes.func,
    },
  },
);
