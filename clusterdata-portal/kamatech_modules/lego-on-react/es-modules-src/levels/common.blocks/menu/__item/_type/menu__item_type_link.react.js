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
import { declMod } from '@parma-lego/i-bem-react';

export default declMod(
  { type: 'link' },
  {
    block: 'menu',
    elem: 'item',
    tag: 'a',
    attrs: function attrs(_ref) {
      var url = _ref.url,
        target = _ref.target;

      return _extends({}, this.__base.apply(this, arguments), {
        role: 'link',
        href: url,
        target: target,
      });
    },
  },
  {
    propTypes: {
      target: PropTypes.string,
      url: PropTypes.string,
    },
  },
);
