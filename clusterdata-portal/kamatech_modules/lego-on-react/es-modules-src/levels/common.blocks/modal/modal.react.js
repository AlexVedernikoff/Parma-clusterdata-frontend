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
import { findDOMNode } from 'react-dom';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';

import '../popup2/popup2.react.js';
import _popup2_theme_normal from '../popup2/_theme/popup2_theme_normal.react.js';

var Popup2 = _popup2_theme_normal.applyDecls();

// import "./../popup2/popup2.css";
// import "./../popup2/_theme/popup2_theme_normal.css";

import { AVAILABLE_DIRECTIONS } from '../popup2/popup2.react';

export var ZINDEX_GROUP_LEVEL = 20;

export default decl(
  Popup2,
  {
    block: 'modal',
    willInit: function willInit(_ref) {
      var zIndexGroupLevel = _ref.zIndexGroupLevel;

      this.__base.apply(this, arguments);

      // CSS-свойство z-index в модальном окне будут начинаться от (zIndexGroupLevel + 1) * 1000
      this._zIndexGroupLevel = zIndexGroupLevel || ZINDEX_GROUP_LEVEL;
    },
    attrs: function attrs(_ref2) {
      var style = _ref2.style;
      var zIndex = this._style.popup.zIndex;

      return _extends({}, this.__base.apply(this, arguments), {
        style: _extends({ zIndex: zIndex }, style),
      });
    },
    mods: function mods(_ref3) {
      var autoclosable = _ref3.autoclosable,
        theme = _ref3.theme,
        visible = _ref3.visible;

      return {
        autoclosable: bool2string(autoclosable),
        visible: bool2string(visible),
        theme: theme,
      };
    },
    content: function content(_ref4) {
      var _this = this;

      var children = _ref4.children,
        verticalAlign = _ref4.verticalAlign;

      return React.createElement(
        Bem,
        { block: 'modal', elem: 'table' },
        React.createElement(
          Bem,
          {
            block: 'modal',
            elem: 'cell',
            attrs: {
              style: { verticalAlign: verticalAlign },
            },
          },
          React.createElement(
            Bem,
            {
              block: 'modal',
              elem: 'content',
              attrs: {
                ref: function ref(_ref5) {
                  return (_this._contentElement = findDOMNode(_ref5));
                },
              },
            },
            children,
          ),
        ),
      );
    },
  },
  {
    defaultProps: {
      target: 'position',
      position: { left: 0, top: 0 },
      theme: 'normal',

      // FIXME: https://github.com/bem/bem-react-core/issues/13 – @grape
      directions: AVAILABLE_DIRECTIONS,
      mainOffset: 0,
      secondaryOffset: 0,
      viewportOffset: 0,
      zIndexGroupLevel: 0,
    },
  },
);
