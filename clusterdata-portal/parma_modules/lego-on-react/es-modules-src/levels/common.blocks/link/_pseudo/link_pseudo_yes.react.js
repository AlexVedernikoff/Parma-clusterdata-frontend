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
import PropTypes from 'prop-types';
import _keycodes from '../../keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

import { declMod, bool2string } from '@parma-lego/i-bem-react';
import _link__inner from '../__inner/link__inner.react.js';

var LinkInner = _link__inner.applyDecls();

// import "./../__inner/link__inner.css";

export default declMod(
  { pseudo: true },
  {
    block: 'link',
    mods: function mods(_ref) {
      var pseudo = _ref.pseudo;
      var pressed = this.state.pressed;

      return _extends({}, this.__base.apply(this, arguments), {
        pseudo: bool2string(pseudo),
        pressed: pressed,
      });
    },
    content: function content(_ref2) {
      var inner = _ref2.inner;

      var content = this.__base.apply(this, arguments);
      if (!inner) {
        return React.createElement(LinkInner, { key: 'inner' }, content);
      }

      return content;
    },
    onClick: function onClick(e) {
      e.preventDefault();

      this.props.onClick && this.props.onClick(e);
    },
    onKeyDown: function onKeyDown(e) {
      if (Keys.is(e.which, 'ENTER', 'SPACE')) {
        if (e.which === Keys.SPACE) {
          e.preventDefault(); // Отменяем scroll.
        }

        this.setState({ pressed: true });
      }
    },
    onKeyUp: function onKeyUp(e) {
      if (Keys.is(e.which, 'ENTER', 'SPACE')) {
        this.setState({ pressed: false });
      }
    },
  },
  {
    propTypes: {
      inner: PropTypes.bool,
    },
  },
);
