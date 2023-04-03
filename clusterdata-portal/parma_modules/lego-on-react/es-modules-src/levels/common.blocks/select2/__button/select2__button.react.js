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
import { decl } from '@parma-lego/i-bem-react';
import _button from '../../button2/button2.react.js';

var Button = _button.applyDecls(); // eslint-disable-line

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
import "./../../button2/_size/button2_size_n.css";
import "./../../button2/_width/button2_width_max.css";
import "./../../button2/_tone/button2_tone.css";
import "./../../button2/_tone/button2_tone_default.css";
import "./../../button2/_tone/button2_tone_dark.css";
import "./../../button2/_tone/button2_tone_red.css";
import "./../../button2/_tone/button2_tone_grey.css";
import "./../../button2/_view/button2_view_classic.css";
import "./../../button2/_view/button2_view_default.css";*/ import '../../icon/icon.react.js';
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

export default decl({
  block: 'select2',
  elem: 'button',
  render: function render() {
    var block = this.block,
      elem = this.elem,
      _props = this.props,
      val = _props.val,
      view = _props.view,
      tone = _props.tone,
      items = _props.items,
      opened = _props.opened,
      placeholder = _props.placeholder,
      multiselectable = _props.multiselectable,
      buttonProps = _props.buttonProps;

    var id = this.generateId();
    var arrowIconOptions = _extends(
      {},
      view === 'default' ? { glyph: 'carets-v' } : { type: 'arrow', direction: opened ? 'top' : 'bottom' },
      {
        key: 'arrow',
        mix: { block: block, elem: 'arrow' },
      },
    );

    var icon = void 0;
    items.some(function(item) {
      if (val.indexOf(item.props.val) !== -1 && item.props.icon) {
        icon = React.cloneElement(item.props.icon, { key: 'icon' });
        return true;
      }
      return false;
    });

    return React.createElement(
      Button,
      _extends(
        {
          innerRef: this.props.setAnchor,
          width: 'max',
          tone: tone,
          view: view,
          mix: { block: block, elem: elem },
          attrs: {
            role: 'listbox',
            'aria-expanded': opened ? 'true' : undefined,
            'aria-labelledby': id,
            'aria-multiselectable': multiselectable ? 'true' : undefined,
          },
          textAttrs: { id: id },
          text: placeholder,
          iconLeft: icon,
          iconRight: React.createElement(Icon, _extends({ key: 'arrow' }, arrowIconOptions)),
        },
        buttonProps,
      ),
    );
  },
});
