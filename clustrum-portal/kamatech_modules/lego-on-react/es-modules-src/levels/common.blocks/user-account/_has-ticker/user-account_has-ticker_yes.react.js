function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import { declMod } from '@kamatech-lego/i-bem-react';
import _ticker from '../../ticker/ticker.react.js';

var Ticker = _ticker.applyDecls();

/*
import "./../../ticker/ticker.css";
import "./../../ticker/_state/ticker_state_empty.css";
import "./../__ticker/user-account__ticker.css";
*/

export default declMod(
  function(_ref) {
    var hasTicker = _ref.hasTicker,
      tickerCount = _ref.tickerCount;

    return hasTicker || tickerCount;
  },
  {
    block: 'user-account',
    content: function content(_ref2) {
      var tickerCount = _ref2.tickerCount,
        tickerMaxCount = _ref2.tickerMaxCount,
        children = _ref2.children;

      if (children) {
        return children;
      }

      var block = this.block;

      return [].concat(_toConsumableArray(this.__base.apply(this, arguments)), [
        React.createElement(Ticker, {
          key: 'ticker',
          mix: { block: block, elem: 'ticker' },
          count: tickerCount,
          maxCount: tickerMaxCount,
        }),
      ]);
    },
  },
  {
    propTypes: {
      hasTicker: PropTypes.bool,
      tickerCount: PropTypes.number,
    },
  },
);
