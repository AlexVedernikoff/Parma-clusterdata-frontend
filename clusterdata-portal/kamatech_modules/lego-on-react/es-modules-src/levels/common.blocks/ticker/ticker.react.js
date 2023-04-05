import React from 'react';
import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';
import _ticker__count from './__count/ticker__count.react.js';

var TickerCount = _ticker__count.applyDecls();

/*
import "./__count/ticker__count.css";
import "./../a11y-hidden/a11y-hidden.css";
*/

export default decl(
  {
    block: 'ticker',
    tag: 'span',
    attrs: function attrs(_ref) {
      var title = _ref.count;

      return {
        title: title,
        role: 'alert',
        'aria-live': 'assertive',
        'aria-atomic': 'true',
      };
    },
    mods: function mods(_ref2) {
      var count = _ref2.count;

      return {
        state: count ? 'normal' : 'empty',
      };
    },
    content: function content(_ref3) {
      var url = _ref3.url,
        count = _ref3.count,
        maxCount = _ref3.maxCount;

      return React.createElement(TickerCount, { url: url, count: count, maxCount: maxCount });
    },
  },
  {
    propTypes: {
      url: PropTypes.string,
      count: PropTypes.number,
      maxCount: PropTypes.number,
    },
    defaultProps: {
      count: 0,
      maxCount: 99,
    },
  },
);
