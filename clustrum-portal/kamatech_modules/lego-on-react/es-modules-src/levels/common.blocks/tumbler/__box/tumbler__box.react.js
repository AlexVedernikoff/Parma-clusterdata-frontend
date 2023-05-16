function _extends() {
  _extends =
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
  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

import React from 'react';
import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';
import _button from '../../button2/button2.react.js';

var Button = _button.applyDecls();

// import "./../../button2/button2.css";
// import "./../../../desktop.blocks/button2/button2.css";
// import "./../../button2/_theme/button2_theme_normal.css";
// import "./../../../desktop.blocks/button2/_theme/button2_theme_normal.css";

import _tumbler__sticker from '../__sticker/tumbler__sticker.react.js';

var TumblerSticker = _tumbler__sticker.applyDecls();
//
// import "./../__sticker/tumbler__sticker.css";
// import "./../__button/tumbler__button.css";
export default decl(
  {
    block: 'tumbler',
    elem: 'box',
    tag: 'span',
    willInit: function willInit() {
      this.onClick = this.onClick.bind(this);
      this.buttonReference = this.buttonReference.bind(this);
    },
    attrs: function attrs() {
      return _objectSpread({}, this.__base.apply(this, arguments), {
        onClick: this.onClick,
      });
    },
    content: function content(_ref) {
      var id = _ref.id,
        view = _ref.view,
        checked = _ref.checked,
        disabled = _ref.disabled,
        tabIndex = _ref.tabIndex;
      var labelledBy = this.context.getLabel(id);
      return [
        React.createElement(
          TumblerSticker,
          _extends(
            {
              key: '0',
            },
            {
              position: 'left',
            },
          ),
          'Вкл',
        ),
        React.createElement(
          TumblerSticker,
          _extends(
            {
              key: '1',
            },
            {
              position: 'right',
            },
          ),
          'Откл',
        ),
        React.createElement(
          Button,
          _extends(
            {
              key: 'button',
            },
            {
              prvntKeys: ['ENTER'],
              theme: 'normal',
              size: 'm',
              tabIndex: tabIndex,
              view: view === 'classic' ? 'classic' : false,
              disabled: disabled,
              mix: {
                block: 'tumbler',
                elem: 'button',
              },
              innerRef: this.buttonReference,
              attrs: {
                'aria-labelledby': labelledBy,
                'aria-pressed': String(checked),
              },
            },
          ),
        ),
      ];
    },
    onClick: function onClick(event) {
      this.button.focus();
      this.props.onChange && this.props.onChange(event);
    },
    buttonReference: function buttonReference(button) {
      this.button = button;
      this.props.buttonRef && this.props.buttonRef(button);
    },
  },
  {
    contextTypes: {
      getLabel: PropTypes.func,
    },
  },
);
