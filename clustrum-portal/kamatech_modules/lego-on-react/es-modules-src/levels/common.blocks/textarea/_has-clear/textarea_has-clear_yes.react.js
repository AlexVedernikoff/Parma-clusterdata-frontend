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
import { declMod, bool2string } from '@kamatech-lego/i-bem-react';
import _textarea__clear from '../__clear/textarea__clear.react.js';

var TextAreaClear = _textarea__clear.applyDecls();

//import "./../__clear/textarea__clear.css";
//import "./../__clear/_visible/textarea__clear_visible_yes.css";

export default declMod(
  function(props) {
    return props.hasClear && !(props.controlAttrs && props.controlAttrs.readOnly);
  },
  {
    block: 'textarea',
    mods: function mods(_ref) {
      var hasClear = _ref.hasClear;

      return _extends({}, this.__base.apply(this, arguments), {
        'has-clear': bool2string(hasClear),
      });
    },
    content: function content(_ref2) {
      var visible = _ref2.text,
        theme = _ref2.theme;
      var disabled = this.state.disabled;

      return [].concat(
        this.__base.apply(this, arguments),
        React.createElement(TextAreaClear, {
          onClick: this._onClearClick.bind(this),
          key: 'clear',
          disabled: disabled,
          visible: visible,
          theme: theme,
        }),
      );
    },
    _onClearClick: function _onClearClick(e) {
      this._control.focus();
      this.setState({ focused: true });

      this.props.onClearClick && this.props.onClearClick(e);

      if (!e.isDefaultPrevented()) {
        this.props.onChange('', this.props, { source: 'clear' });
      }
    },
  },
  {
    propTypes: {
      hasClear: PropTypes.bool,
    },
  },
);
