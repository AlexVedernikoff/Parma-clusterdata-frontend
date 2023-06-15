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
import Bem, { decl } from '@kamatech-lego/i-bem-react';
import _ticker__value from '../__value/ticker__value.react.js';

var TickerValue = _ticker__value.applyDecls();

// import "./../__value/ticker__value.css";

export default decl(
  {
    block: 'ticker',
    elem: 'count',
    tag: function tag(_ref) {
      var url = _ref.url;

      return url ? 'a' : 'span';
    },
    attrs: function attrs(_ref2) {
      var href = _ref2.url;

      return { href: href };
    },
    content: function content(_ref3) {
      var url = _ref3.url,
        count = _ref3.count,
        maxCount = _ref3.maxCount;
      var block = this.block,
        mix = this.props.mix;

      return [
        React.createElement(
          Bem,
          { key: 'text', block: block, elem: 'text', mix: { block: 'a11y-hidden' } },
          'Уведомлений',
        ),
        React.createElement(
          TickerValue,
          _extends(
            { key: 'value' },
            {
              count: count,
              maxCount: maxCount,
              mix: !url && [{ block: block, elem: 'plain' }, mix],
            },
          ),
        ),
      ];
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
