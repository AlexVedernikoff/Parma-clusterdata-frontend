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
import { declMod } from '@kamatech-lego/i-bem-react';
import _button from '../../button2/button2.react.js';

var Button = _button.applyDecls();

/*
import "./../../button2/button2.css";
import "./../../../desktop.blocks/button2/button2.css";
import "./../../button2/_theme/button2_theme_normal.css";
import "./../../../desktop.blocks/button2/_theme/button2_theme_normal.css";
import "./../../button2/_theme/button2_theme_pseudo.css";
import "./../../../desktop.blocks/button2/_theme/button2_theme_pseudo.css";
import "./../../button2/_size/button2_size_xs.css";
import "./../../button2/_size/button2_size_s.css";
import "./../../button2/_size/button2_size_m.css";
import "./../../button2/_width/button2_width_max.css";*/

import '../../icon/icon.react.js';
import '../../icon/_glyph/icon_glyph.react.js';
import _icon_glyph_caretsV from '../../icon/_glyph/icon_glyph_carets-v.react.js';

var Icon = _icon_glyph_caretsV.applyDecls();

/*
import "./../../icon/icon.css";
import "./../../icon/_type/icon_type_arrow.css";
import "./../../../desktop.blocks/icon/_type/icon_type_arrow.css";
import "./../../icon/_glyph/icon_glyph.css";
import "./../../icon/_glyph/icon_glyph_carets-v.css";
*/

export default declMod(
  { switcher: 'button2' },
  {
    block: 'dropdown2',
    _renderSwitcher: function _renderSwitcher(_ref) {
      var view = _ref.view,
        tone = _ref.tone,
        theme = _ref.theme,
        size = _ref.size,
        disabled = _ref.disabled,
        children = _ref.children,
        onClick = _ref.onClick,
        hasTick = _ref.hasTick,
        ref = _ref.ref;
      var block = this.block;
      var opened = this.state.opened;

      var icon = void 0;
      if (hasTick) {
        icon = React.createElement(
          Icon,
          _extends(
            { key: 'arrow' },
            _extends(
              {},
              view === 'default' ? { glyph: 'carets-v' } : { type: 'arrow', direction: opened ? 'top' : 'bottom' },
            ),
            {
              mix: { block: block, elem: 'arrow' },
            },
          ),
        );
      }
      return React.createElement(
        Button,
        _extends(
          {
            view: view,
            tone: tone,
            size: size,
            theme: theme,
          },
          Object(this.__switcher).props || {},
          {
            ref: ref,
            disabled: disabled,
            onClick: disabled ? undefined : onClick,
            key: 'button',
            text: null,
          },
        ),
        children,
        icon,
      );
    },
  },
);
