import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';

export default decl(
  {
    block: 'user-account',
    elem: 'name',
    tag: 'span',
    content: function content(_ref) {
      var text = _ref.text,
        children = _ref.children;

      return children || text;
    },
  },
  {
    propTypes: {
      text: PropTypes.string,
    },
  },
);
