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
import Bem, { decl } from '@parma-lego/i-bem-react';
import _ticker__value from '../__value/ticker__value.react.js';

var TickerValue = _ticker__value.applyDecls();

// import "./../__value/ticker__value.css";

var i18n = (function() {
  var core = require('bem-i18n');

  if (
    process.env.BEM_LANG
      ? process.env.BEM_LANG === 'ru'
      : process.env.REACT_APP_BEM_LANG
      ? process.env.REACT_APP_BEM_LANG === 'ru'
      : 'en' === 'ru'
  ) {
    return core().decl(require('../__text/ticker__text.i18n/ru'))('ticker__text');
  }

  /*
    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
        return core().decl(require('./../__text/ticker__text.i18n/en'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
        return core().decl(require('./../__text/ticker__text.i18n/be'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
        return core().decl(require('./../__text/ticker__text.i18n/id'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
        return core().decl(require('./../__text/ticker__text.i18n/kk'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
        return core().decl(require('./../__text/ticker__text.i18n/tr'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
        return core().decl(require('./../__text/ticker__text.i18n/tt'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
        return core().decl(require('./../__text/ticker__text.i18n/uk'))('ticker__text');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
        return core().decl(require('./../__text/ticker__text.i18n/uz'))('ticker__text');
    }*/

  if (process.env.NODE_ENV === 'development') {
    process.env.BEM_LANG &&
      console.error(
        'No match of process.env.BEM_LANG { ' +
          process.env.BEM_LANG +
          ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
    process.env.REACT_APP_BEM_LANG &&
      console.error(
        'No match of process.env.REACT_APP_BEM_LANG { ' +
          process.env.REACT_APP_BEM_LANG +
          ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
  }

  return function() {};
})();

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
          i18n('notifications'),
        ),
        React.createElement(
          TickerValue,
          _extends(
            { key: 'value' },
            { count: count, maxCount: maxCount, mix: !url && [{ block: block, elem: 'plain' }, mix] },
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
