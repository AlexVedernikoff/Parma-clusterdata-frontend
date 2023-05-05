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
import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { type: 'link' },
  {
    block: 'button2',
    tag: 'a',
    willInit: function willInit() {
      this.__base.apply(this, arguments);
      this.defaultPressKeys = ['ENTER'];
    },
    attrs: function attrs(_ref) {
      var target = _ref.target,
        url = _ref.url,
        rel = _ref.rel,
        _ref$tabIndex = _ref.tabIndex,
        tabIndex = _ref$tabIndex === undefined ? 0 : _ref$tabIndex;
      var disabled = this.state.disabled;

      if (target === '_blank') {
        if (rel && rel.indexOf('noopener') === -1) {
          rel = rel + ' noopener'; // Пользовательский атрибут имеет больший приоритет
        }
      }

      return _extends({}, this.__base.apply(this, arguments), {
        rel: rel,
        target: target,
        type: undefined,
        autoComplete: undefined,
        href: disabled ? undefined : url,
        disabled: undefined,
        tabIndex: disabled ? -1 : tabIndex,
      });
    },
  },
  {
    propTypes: {
      url: PropTypes.string,
      target: PropTypes.string,
      type: PropTypes.string,
      rel: PropTypes.string,
    },
  },
);
