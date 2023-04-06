import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'popup2',
    elem: 'tail',
    attrs: function attrs(_ref) {
      var style = _ref.style;
      var _context = this.context,
        tailStyles = _context.tailStyles,
        setTailRef = _context.setTailRef;

      var styles = Object.keys(style) > 0 ? style : tailStyles;

      return {
        style: styles,
        ref: setTailRef,
      };
    },
    content: function content(_ref2) {
      var children = _ref2.children;

      return children;
    },
  },
  {
    propTypes: {
      style: PropTypes.object,
    },
    defaultProps: {
      style: {},
    },
    contextTypes: {
      tailStyles: PropTypes.object.isRequired,
      setTailRef: PropTypes.func.isRequired,
    },
  },
);
