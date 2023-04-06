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

import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../../menu/menu.react.js';
import '../../../desktop.blocks/menu/menu.react.js';
import '../../menu/_type/menu_type_check.react.js';
import '../../menu/_type/menu_type_radio.react.js';
import '../../menu/_type/menu_type_radiocheck.react.js';
import _menu_view_default from '../../menu/_view/menu_view_default.react.js';

var Menu = _menu_view_default.applyDecls(); // eslint-disable-line

/*
import "./../../menu/menu.css";
import "./../../menu/_theme/menu_theme_normal.css";
import "./../../menu/_width/menu_width_max.css";
import "./../../menu/_size/menu_size_xs.css";
import "./../../menu/_size/menu_size_s.css";
import "./../../menu/_size/menu_size_m.css";
import "./../../menu/_size/menu_size_n.css";
import "./../../menu/_view/menu_view_classic.css";
import "./../../menu/_view/menu_view_default.css";
import "./../../menu/_tone/menu_tone.css";
import "./../../menu/_tone/menu_tone_default.css";
import "./../../menu/_tone/menu_tone_dark.css";
import "./../../menu/_tone/menu_tone_red.css";
import "./../../menu/_tone/menu_tone_grey.css";*/ export default decl(
  {
    block: 'select2',
    elem: 'menu',
    willInit: function willInit() {
      this.state = {};
    },
    willReceiveProps: function willReceiveProps(nextProps) {
      var drawingParams = nextProps.getDrawingParams();
      if (drawingParams) {
        var menuDomElem = findDOMNode(this._menu);
        var menuWidth = menuDomElem.getBoundingClientRect().width;
        var bestHeight = 0;

        drawingParams.forEach(function (params) {
          params.width >= menuWidth && params.height > bestHeight && (bestHeight = params.height);
        });

        if (bestHeight > 0) {
          this.setState({ maxHeight: Math.min(nextProps.maxHeight, bestHeight) });
        }
      }
    },
    didMount: function didMount() {
      this.__base.apply(this, arguments);
      this.context.getMenu(this._menu);
    },
    render: function render() {
      var _this = this;

      var block = this.block,
        elem = this.elem,
        _props = this.props,
        itemIconHidden = _props.itemIconHidden,
        menuProps = _props.menuProps,
        items = _props.items,
        view = _props.view,
        tone = _props.tone;

      var mods = {
        'item-icon-hidden': bool2string(itemIconHidden),
      };

      return React.createElement(
        Menu,
        _extends(
          {
            view: view,
            tone: tone,
            ref: function ref(m) {
              return (_this._menu = m);
            },
            mix: { block: block, elem: elem, mods: mods },
            width: 'max',
            style: { maxHeight: this.state.maxHeight },
            tabIndex: null,
          },
          menuProps,
        ),
        items,
      );
    },
  },
  {
    contextTypes: {
      getMenu: PropTypes.func,
    },
  },
);
