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
import { findDOMNode } from 'react-dom';
import { declMod, bool2string } from '@kamatech-lego/i-bem-react';
import _keycodes from '../../keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

import '../../popup2/popup2.react.js';
import '../../popup2/_theme/popup2_theme_normal.react.js';
import _popup2_target_anchor from '../../popup2/_target/popup2_target_anchor.react.js';

var Popup = _popup2_target_anchor.applyDecls();

//import "./../../popup2/popup2.css";
//import "./../../popup2/_theme/popup2_theme_normal.css";
import '../__suggest-item/textinput__suggest-item.react.js';
import _textinput__suggestItem from '../../../desktop.blocks/textinput/__suggest-item/textinput__suggest-item.react.js';

var SuggestItem = _textinput__suggestItem.applyDecls();

//import "./../__suggest-item/textinput__suggest-item.css";
import _textinput__box from '../__box/textinput__box.react.js';

var TextInputBox = _textinput__box.applyDecls();

//import "./../__box/textinput__box.css";

export default declMod(
  { suggest: true },
  {
    block: 'textinput',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.state.suggestVisible = false;
      this.state.items = [];
      this.state.metainfo = {};
      this.state.popupWidth = 100;
      this.state.currentItem = -1;
      this.state.origText = null;

      this._onDocKeyDown = this._onDocKeyDown.bind(this);
      this._onItemMouseDown = this._onItemMouseDown.bind(this);
      this._onItemMouseEnter = this._onItemMouseEnter.bind(this);
      this._onItemMouseLeave = this._onItemMouseLeave.bind(this);
      this._onKeyDown = this._onKeyDown.bind(this);
      this._onKeyPress = this._onKeyPress.bind(this);
    },
    didMount: function didMount() {
      this.__base.apply(this, arguments);

      this.setState({
        popupWidth: this._boxDom.offsetWidth,
      });
    },
    mods: function mods(_ref) {
      var suggest = _ref.suggest;

      return _extends({}, this.__base.apply(this, arguments), {
        suggest: bool2string(suggest),
      });
    },
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        onKeyDown: this._onKeyDown,
        onKeyPress: this._onKeyPress,
      });
    },
    content: function content(_ref2) {
      var _this = this;

      var suggestUrl = _ref2.suggestUrl,
        popupProps = _ref2.popupProps;
      var block = this.block;

      var content = this.__base.apply(this, arguments);

      content = Children.map(content, function(item) {
        if (TextInputBox.isBox(item)) {
          return React.cloneElement(item, {
            ref: function ref(c) {
              _this._box = c;
              _this._boxDom = findDOMNode(c);
            },
          });
        }

        return item;
      });

      this.elems = this._buildPopupContent(this.state.items, this.state.metainfo);

      content.push(
        React.createElement(
          Popup,
          _extends(
            {
              mix: { block: block, elem: 'popup' },
              key: 'popup',
              theme: 'normal',
              mainOffset: 0,
              zIndexGroupLevel: this.props.zIndexGroupLevel,
              directions: ['bottom-left'],
              visible: this.state.suggestVisible,
              style: { minWidth: this.state.popupWidth },
              anchor: this._box,
            },
            popupProps,
          ),
          this.elems,
        ),
      );

      return content;
    },
    _onDocKeyDown: function _onDocKeyDown(e) {
      if (e.which === Keys.ESC) {
        this._suggestHide();
      }
    },
    _onClearClick: function _onClearClick(e) {
      this.preventShow = true;
      this._suggestHide();
      var res = this.__base.apply(this, arguments);
      this.preventShow = false;
      return res;
    },
    _onChange: function _onChange(e) {
      this._doRequest(e);
      return this.__base.apply(this, arguments);
    },
    _suggestShow: function _suggestShow() {
      window.addEventListener('keydown', this._onDocKeyDown);
    },
    _suggestHide: function _suggestHide() {
      window.removeEventListener('keydown', this._onDocKeyDown);

      this.elems = [];
      this.setState({
        items: [],
        metainfo: {},
        currentItem: -1,
        origText: null,
        suggestVisible: false,
      });
    },
    _doRequest: function _doRequest(e) {
      var _this2 = this;

      var val = e.target.value || '';
      var _props = this.props,
        dataprovider = _props.dataprovider,
        suggestUrl = _props.suggestUrl;

      dataprovider(suggestUrl, val, function(items, metainfo) {
        var suggestVisible = _this2.state.focused && Boolean(items.length);
        if (_this2.state.suggestVisible !== suggestVisible) {
          _this2._suggestShow();
        }

        _this2.setState({
          items: items,
          metainfo: metainfo,
          suggestVisible: suggestVisible,
          currentItem: -1,
          origText: null,
        });
      });
    },
    onFocus: function onFocus(e) {
      if (this.props.showListOnFocus && !this.preventShow) {
        this._doRequest(e);
      }
      return this.__base.apply(this, arguments);
    },
    onBlur: function onBlur() {
      this._suggestHide();
      return this.__base.apply(this, arguments);
    },
    _onSelectItem: function _onSelectItem(item, byKeyboard) {
      var _this3 = this;

      this.props.onChange &&
        this.props.onChange(item.props.val, this.props, { source: 'suggest', byKeyboard: byKeyboard });
      this._setCarret();
      this._suggestHide();
      if (!byKeyboard) {
        this.preventShow = true;
        setTimeout(function() {
          _this3.focus();
          _this3.preventShow = false;
        }, 1);
      }
    },
    _setCarret: function _setCarret() {
      var control = this._control;
      var pos = control.value.length;
      if (control.selectionStart === pos) {
        control.setSelectionRange(pos, pos); // FF, IE11
      }
    },
    _onItemMouseDown: function _onItemMouseDown(e, item) {
      this._onSelectItem(item);
    },
    _onItemMouseEnter: function _onItemMouseEnter(e, item) {
      this.setState({ currentItem: item.props.pos });
    },
    _onItemMouseLeave: function _onItemMouseLeave(e, item) {
      this.setState({ currentItem: -1 });
    },
    _onKeyDown: function _onKeyDown(e) {
      if (Keys.is(e.which, 'DOWN', 'UP') && !e.shiftKey) {
        e.preventDefault();

        var len = this.state.items.length;
        if (len) {
          var direction = e.which - 39;
          var currentItem = this.state.currentItem;

          if ((currentItem === 0 && direction === -1) || currentItem + direction >= len) {
            if (this.state.origText !== null && this.props.onChange) {
              this.props.onChange(this.state.origText, this.props, { source: 'suggest' });
            }

            this.setState({ currentItem: -1, origText: null });
            return;
          }

          currentItem += direction;
          if (currentItem < 0) {
            currentItem = len - 1;
          } else if (currentItem >= len) {
            currentItem = 0;
          }

          this.setState({ currentItem: currentItem });

          if (this.props.updateOnEnter) {
            if (this.state.origText === null) {
              this.setState({ origText: this.props.text });
            }

            if (this.props.onChange) {
              this.props.onChange(this.elems[currentItem].props.val, this.props, {
                source: 'suggest',
                itemIndex: currentItem,
              });
            }
          }
        }
      }
    },
    _onKeyPress: function _onKeyPress(e) {
      if (e.which === Keys.ENTER && this.state.currentItem > -1) {
        e.preventDefault();
        this._onSelectItem(this.elems[this.state.currentItem], true);
      }
    },
    _buildPopupContent: function _buildPopupContent(items, metainfo) {
      var _this4 = this;

      return items.map(function(item, i) {
        var type = 'text';
        var text = item;
        if (Array.isArray(item)) {
          type = item[0];
          text = item[1];
        }

        return React.createElement(
          SuggestItem,
          {
            key: 'item' + i, // eslint-disable-line react/no-array-index-key
            type: type,
            pos: i,
            val: text,
            hovered: _this4.state.currentItem === i,
            onMouseEnter: _this4._onItemMouseEnter,
            onMouseLeave: _this4._onItemMouseLeave,
            onMouseDown: _this4._onItemMouseDown,
          },
          text,
        );
      });
    },
  },
  {
    propTypes: {
      dataprovider: PropTypes.func,
      suggestUrl: PropTypes.string,
      popupProps: PropTypes.object,
      showListOnFocus: PropTypes.bool,
      updateOnEnter: PropTypes.bool,
      zIndexGroupLevel: PropTypes.number,
    },
    defaultProps: {
      showListOnFocus: true,
      updateOnEnter: true,
    },
  },
);
