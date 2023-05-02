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

import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../../control/control.react.js';
import _control from '../../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

export default decl(
  Control,
  {
    block: 'textinput',
    elem: 'suggest-item',
    willInit: function willInit() {
      this.__base.apply(this, arguments);
      this.state.hovered = false;

      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);
    },
    mods: function mods(_ref) {
      var type = _ref.type;

      return _extends({}, this.__base.apply(this, arguments), {
        type: type,
        hovered: bool2string(this.props.hovered || this.state.hovered),
      });
    },
    onMouseDown: function onMouseDown(e) {
      this.props.onMouseDown && this.props.onMouseDown(e, this);
    },
  },
  {
    propTypes: {
      type: PropTypes.string,
      val: PropTypes.string,
      pos: PropTypes.number,
      hovered: PropTypes.bool,
      onMouseDown: PropTypes.func,
      onMouseEnter: PropTypes.func,
    },
    defaultProps: {
      type: 'text',
      pos: -1,
    },
  },
);
