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
import { decl } from '@kamatech-lego/i-bem-react';
import '../../popup2/popup2.react.js';
import '../../popup2/_theme/popup2_theme_normal.react.js';
import '../../popup2/_target/popup2_target_anchor.react.js';
import '../../popup2/_autoclosable/popup2_autoclosable_yes.react.js';
import _popup2_hiding_yes from '../../popup2/_hiding/popup2_hiding_yes.react.js';

var Popup = _popup2_hiding_yes.applyDecls(); // eslint-disable-line

/*
import "./../../popup2/popup2.css";
import "./../../popup2/_theme/popup2_theme_normal.css";
import "./../../popup2/_view/popup2_view_default.css";
import "./../../popup2/_tone/popup2_tone.css";
import "./../../popup2/_tone/popup2_tone_default.css";
import "./../../popup2/_tone/popup2_tone_red.css";
import "./../../popup2/_tone/popup2_tone_grey.css";
import "./../../popup2/_tone/popup2_tone_dark.css";*/ import '../__menu/select2__menu.react.js';
import _select2__menu from '../../../desktop.blocks/select2/__menu/select2__menu.react.js';

var SelectMenu = _select2__menu.applyDecls();

export default decl({
  block: 'select2',
  elem: 'popup',
  willInit: function willInit() {
    this.__base.apply(this, arguments);

    this._calcDrawingParams = this._calcDrawingParams.bind(this);
    this._getDrawingParams = this._getDrawingParams.bind(this);
  },
  render: function render() {
    var block = this.block,
      elem = this.elem,
      _props = this.props,
      items = _props.items,
      maxHeight = _props.maxHeight,
      menuProps = _props.menuProps,
      popupProps = _props.popupProps,
      zIndexGroupLevel = _props.zIndexGroupLevel,
      itemIconHidden = _props.itemIconHidden;

    // Во view_default попап плотнее прилегает к кнопке,
    // поэтому в этом случае проставляется mainOffset: 2

    return React.createElement(
      Popup,
      _extends(
        {
          autoclosable: true,
          hiding: true,
          mix: { block: block, elem: elem },
          directions: ['bottom-left', 'bottom-right', 'top-left', 'top-right'],
          anchor: this.props.setAnchor,
          calcPossible: this._calcDrawingParams,
          viewportOffset: 0,
          mainOffset: popupProps.view === 'default' ? 2 : undefined,
          zIndexGroupLevel: zIndexGroupLevel,
        },
        popupProps,
      ),
      React.createElement(SelectMenu, {
        items: items,
        menuProps: menuProps,
        maxHeight: maxHeight,
        itemIconHidden: itemIconHidden,
        getDrawingParams: this._getDrawingParams,
      }),
    );
  },
  _calcDrawingParams: function _calcDrawingParams(drawingParams) {
    this._drawingParams = drawingParams;
  },
  _getDrawingParams: function _getDrawingParams(drawingParams) {
    return this._drawingParams;
  },
});
