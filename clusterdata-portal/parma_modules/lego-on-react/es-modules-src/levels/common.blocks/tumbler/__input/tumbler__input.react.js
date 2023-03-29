function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';
export default decl(
  {
    block: 'tumbler',
    elem: 'input',
    tag: 'input',
    attrs: function attrs(_ref) {
      var id = _ref.id,
        name = _ref.name,
        value = _ref.value,
        onVal = _ref.onVal,
        offVal = _ref.offVal,
        checked = _ref.checked,
        disabled = _ref.disabled,
        labeledBy = _ref.labeledBy,
        onChange = _ref.onChange,
        _attrs = _ref.attrs,
        tabIndex = _ref.tabIndex;
      var values = [offVal || 'false', onVal || 'true'];
      var labelledBy = this.context.getLabel(id);
      return _objectSpread(
        {
          id: id,
          onChange: onChange,
          disabled: disabled,
          tabIndex: '-1',
          type: 'checkbox',
          name: name || id,
          autoComplete: 'off',
          'aria-hidden': 'true',
          checked: Boolean(checked),
          // Keep input controlled: http://bit.ly/2eY7an2
          'aria-labelledby': labelledBy,
          value: values[Number(!!checked)],
        },
        _attrs,
      );
    },
  },
  {
    contextTypes: {
      getLabel: PropTypes.func,
    },
  },
);
