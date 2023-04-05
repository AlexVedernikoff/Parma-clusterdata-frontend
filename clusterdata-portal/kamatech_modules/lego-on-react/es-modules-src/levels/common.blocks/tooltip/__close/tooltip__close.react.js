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

var i18n = (function() {
  var core = require('bem-i18n');

  if (
    process.env.BEM_LANG
      ? process.env.BEM_LANG === 'ru'
      : process.env.REACT_APP_BEM_LANG
      ? process.env.REACT_APP_BEM_LANG === 'ru'
      : 'en' === 'ru'
  ) {
    return core().decl(require('./tooltip__close.i18n/ru'))('tooltip__close');
  }

  /*
    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
        return core().decl(require('./tooltip__close.i18n/en'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
        return core().decl(require('./tooltip__close.i18n/be'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
        return core().decl(require('./tooltip__close.i18n/id'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
        return core().decl(require('./tooltip__close.i18n/kk'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
        return core().decl(require('./tooltip__close.i18n/tr'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
        return core().decl(require('./tooltip__close.i18n/tt'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
        return core().decl(require('./tooltip__close.i18n/uk'))('tooltip__close');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
        return core().decl(require('./tooltip__close.i18n/uz'))('tooltip__close');
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
    block: 'tooltip',
    elem: 'close',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this._onClick = this._onClick.bind(this);
    },
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        onClick: this._onClick,
        title: i18n('close'),
      });
    },
    _onClick: function _onClick(e) {
      this.props.onClick && this.props.onClick(e);
    },
  },
  {
    propTypes: {
      onClick: PropTypes.func,
    },
  },
);
