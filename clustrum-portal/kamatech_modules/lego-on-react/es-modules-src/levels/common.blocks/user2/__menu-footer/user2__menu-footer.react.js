import React from 'react';
import { decl } from '@kamatech-lego/i-bem-react';
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
        text: 'Настройки',
      }),
      React.createElement(Button, {
        key: 'help',
        size: 's',
        type: 'link',
        theme: 'clear',
        mix: { block: this.block, elem: 'footer-link' },
        url: helpUrl,
        text: 'Помощь',
      }),
    ];
  },
});
