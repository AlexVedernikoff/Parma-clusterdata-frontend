import React from 'react';
import { decl } from '@parma-lego/i-bem-react';
import '../../button2/button2.react.js';
import _button2_type_link from '../../button2/_type/button2_type_link.react.js';

var Button = _button2_type_link.applyDecls();

/*
import "./../../button2/button2.css";
import "./../../../desktop.blocks/button2/button2.css";
import "./../../button2/_size/button2_size_s.css";
import "./../../button2/_theme/button2_theme_clear.css";
import "./../../../desktop.blocks/button2/_theme/button2_theme_clear.css";
*/

var i18n = (function() {
  var core = require('bem-i18n');

  if (
    process.env.BEM_LANG
      ? process.env.BEM_LANG === 'ru'
      : process.env.REACT_APP_BEM_LANG
      ? process.env.REACT_APP_BEM_LANG === 'ru'
      : 'en' === 'ru'
  ) {
    return core().decl(require('../user2.i18n/ru'))('user2');
  }

  /*
    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
        return core().decl(require('./../user2.i18n/en'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
        return core().decl(require('./../user2.i18n/be'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
        return core().decl(require('./../user2.i18n/id'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
        return core().decl(require('./../user2.i18n/kk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
        return core().decl(require('./../user2.i18n/tr'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
        return core().decl(require('./../user2.i18n/tt'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
        return core().decl(require('./../user2.i18n/uk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
        return core().decl(require('./../user2.i18n/uz'))('user2');
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

export default decl({
  block: 'user2',
  elem: 'menu-footer',
  content: function content(_ref) {
    var settingsUrl = _ref.settingsUrl,
      helpUrl = _ref.helpUrl,
      contentRegion = _ref.contentRegion;

    return [
      React.createElement(Button, {
        key: 'settings',
        size: 's',
        type: 'link',
        theme: 'clear',
        mix: { block: this.block, elem: 'footer-link' },
        url: settingsUrl,
        text: i18n('settings'),
      }),
      React.createElement(Button, {
        key: 'help',
        size: 's',
        type: 'link',
        theme: 'clear',
        mix: { block: this.block, elem: 'footer-link' },
        url: helpUrl,
        text: i18n('help'),
      }),
    ];
  },
});
