function _extends() {
  _extends =
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
  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function (key) {
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

var i18n = (function () {
  var core = require('bem-i18n');

  if (
    process.env.BEM_LANG
      ? process.env.BEM_LANG === 'ru'
      : process.env.REACT_APP_BEM_LANG
        ? process.env.REACT_APP_BEM_LANG === 'ru'
        : 'en' === 'ru'
  ) {
    return core().decl(require('../tumbler.i18n/ru'))('tumbler');
  }

  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
  //   return core().decl(require('./../tumbler.i18n/en'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
  //   return core().decl(require('./../tumbler.i18n/be'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
  //   return core().decl(require('./../tumbler.i18n/id'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
  //   return core().decl(require('./../tumbler.i18n/kk'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
  //   return core().decl(require('./../tumbler.i18n/tr'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
  //   return core().decl(require('./../tumbler.i18n/tt'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
  //   return core().decl(require('./../tumbler.i18n/uk'))('tumbler');
  // }
  //
  // if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
  //   return core().decl(require('./../tumbler.i18n/uz'))('tumbler');
  // }

  if (process.env.NODE_ENV === 'development') {
    process.env.BEM_LANG &&
      console.error(
        'No match of process.env.BEM_LANG { ' +
        process.env.BEM_LANG +
        ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
    process.env.REACT_APP_BEM_LANG &&
      console.error(
        'No match of process.env.REACT_APP_BEM_LANG { ' +
        process.env.REACT_APP_BEM_LANG +
        ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
  }

  return function () { };
})();

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
          i18n('on'),
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
          i18n('off'),
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
