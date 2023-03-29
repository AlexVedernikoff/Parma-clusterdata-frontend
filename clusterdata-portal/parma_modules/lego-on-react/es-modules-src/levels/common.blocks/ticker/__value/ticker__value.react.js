import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';

export default decl(
  {
    block: 'ticker',
    elem: 'value',
    tag: 'span',
    content: function content(_ref) {
      var count = _ref.count,
        maxCount = _ref.maxCount;

      return count > maxCount ? '' + maxCount : count;
    },
    attrs: function attrs(_ref2) {
      var title = _ref2.count;

      return { title: title };
    },
  },
  {
    propTypes: {
      count: PropTypes.number,
      maxCount: PropTypes.number,
    },
    defaultProps: {
      count: 0,
      maxCount: 99,
    },
  },
);
