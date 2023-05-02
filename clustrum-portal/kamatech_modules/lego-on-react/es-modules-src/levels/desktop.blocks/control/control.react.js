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

export default decl(
  {
    block: 'control',
    willInit: function willInit(_ref) {
      var hovered = _ref.hovered;

      this.__base.apply(this, arguments);

      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);

      this.state.hovered = hovered;
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var disabled = _ref2.disabled;

      this.__base.apply(this, arguments);

      if (disabled) {
        this.setState({ hovered: false });
      }
    },
    mods: function mods() {
      var _state = this.state,
        hovered = _state.hovered,
        disabled = _state.disabled;

      return _extends({}, this.__base.apply(this, arguments), {
        hovered: disabled ? undefined : bool2string(hovered),
      });
    },
    attrs: function attrs() {
      var disabled = this.state.disabled;

      return _extends({}, this.__base.apply(this, arguments), {
        onMouseEnter: disabled ? undefined : this.onMouseEnter,
        onMouseLeave: disabled ? undefined : this.onMouseLeave,
      });
    },
    onMouseEnter: function onMouseEnter(e) {
      this.setState({ hovered: true });
      this.props.onMouseEnter && this.props.onMouseEnter(e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.setState({ hovered: false });
      this.props.onMouseLeave && this.props.onMouseLeave(e);
    },
  },
  {
    propTypes: {
      hovered: PropTypes.bool,
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
    },
  },
);
