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

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

import { func } from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'textarea',
    elem: 'control',
    tag: 'textarea',
    attrs: function attrs(_ref) {
      var innerRef = _ref.innerRef,
        props = _objectWithoutProperties(_ref, ['innerRef']);

      return _extends({}, props, {
        ref: innerRef,
      });
    },
  },
  {
    propTypes: {
      innerRef: func.isRequired,
    },
  },
);
