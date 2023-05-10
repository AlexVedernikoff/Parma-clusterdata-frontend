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
import { declMod } from '@kamatech-lego/i-bem-react';
import _link from '../../link/link.react.js';

var Link = _link.applyDecls();

//import "./../../link/link.css";
/*
import "./../../../desktop.blocks/link/link.css";
import "./../../link/_theme/link_theme_normal.css";
import "./../../../deskpad.blocks/link/_theme/link_theme_normal.css";
import "./../../../desktop.blocks/link/_theme/link_theme_normal.css";
*/

export default declMod(
  { switcher: 'link' },
  {
    block: 'dropdown2',
    _renderSwitcher: function _renderSwitcher(_ref) {
      var view = _ref.view,
        tone = _ref.tone,
        theme = _ref.theme,
        size = _ref.size,
        disabled = _ref.disabled,
        pseudo = _ref.pseudo,
        inner = _ref.inner,
        url = _ref.url,
        mix = _ref.mix,
        children = _ref.children,
        onClick = _ref.onClick,
        hasTick = _ref.hasTick,
        ref = _ref.ref;

      return React.createElement(
        Link,
        _extends(
          {
            view: view,
            tone: tone,
            theme: theme,
            pseudo: pseudo,
            inner: inner,
            mix: mix,
            url: url,
          },
          Object(this.__switcher).props || {},
          {
            disabled: disabled,
            ref: ref,
            onClick: disabled ? undefined : onClick,
            key: 'link',
          },
        ),
        children,
      );
    },
  },
);
