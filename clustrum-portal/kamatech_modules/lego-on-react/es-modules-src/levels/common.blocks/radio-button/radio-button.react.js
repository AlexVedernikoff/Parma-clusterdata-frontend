import { cloneElement, Children } from 'react';
import { decl } from '@kamatech-lego/i-bem-react';

import _radiobox from '../radiobox/radiobox.react.js';

var RadioBox = _radiobox.applyDecls();

/*
import "./../radiobox/radiobox.css";
import "./../../desktop.blocks/radiobox/radiobox.css";
*/
import _radioButton__radio from './__radio/radio-button__radio.react.js';

var RadioRadio = _radioButton__radio.applyDecls();

/*
import "./__radio/radio-button__radio.css";
import "./../../desktop.blocks/radio-button/__radio/radio-button__radio.css";
import "./__radio/_side/radio-button__radio_side_both.css";
*/

export default decl(
  RadioBox,
  {
    block: 'radio-button',
    // FIXME: оторвать после релиза bem-react-core@1.0.0,
    // https://github.com/bem/bem-react-core/issues/206
    mods: function mods() {
      return this.__base.apply(this, arguments);
    },
    content: function content(_ref) {
      var _this = this;

      var name = _ref.name,
        mainValue = _ref.value,
        mainDisabled = _ref.disabled,
        view = _ref.view,
        children = _ref.children;

      var num = Children.count(children);

      return Children.map(children, function(item, key) {
        var side = num === 1 ? 'both' : '';

        if (num > 1) {
          if (key === 0) {
            side = 'left';
          }

          if (key === num - 1) {
            side = 'right';
          }
        }

        return cloneElement(item, {
          onChange: mainDisabled ? undefined : _this.onChange,
          mainDisabled: mainDisabled,
          mainValue: mainValue,
          name: name,
          side: view === 'default' ? undefined : side,
          key: key,
        });
      });
    },
  },
  {
    Radio: RadioRadio,
  },
);
