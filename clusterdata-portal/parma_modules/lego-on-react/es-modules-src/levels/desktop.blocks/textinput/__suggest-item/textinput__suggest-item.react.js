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
import { decl } from '@parma-lego/i-bem-react';

export default decl(
  {
    block: 'textinput',
    elem: 'suggest-item',
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,
      });
    },
    onMouseEnter: function onMouseEnter(e) {
      this.setState({ hovered: true });
      this.props.onMouseEnter && this.props.onMouseEnter(e, this);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.setState({ hovered: false });
      this.props.onMouseLeave && this.props.onMouseLeave(e, this);
    },
  },
  {
    propTypes: {
      onMouseEnter: PropTypes.func,
      onMouseLeave: PropTypes.func,
    },
  },
);
