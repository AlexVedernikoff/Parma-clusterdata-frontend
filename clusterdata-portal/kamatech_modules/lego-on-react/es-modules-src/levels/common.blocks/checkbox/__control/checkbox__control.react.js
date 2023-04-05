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

import { decl } from '@parma-lego/i-bem-react';

export default decl({
  block: 'checkbox',
  elem: 'control',
  tag: 'input',
  attrs: function attrs(_ref) {
    var id = _ref.id,
      name = _ref.name,
      value = _ref.value,
      checked = _ref.checked,
      disabled = _ref.disabled,
      labeledBy = _ref.labeledBy,
      onChange = _ref.onChange,
      _attrs = _ref.attrs,
      tabIndex = _ref.tabIndex;

    return _extends(
      {
        id: id,
        name: name,
        disabled: disabled,
        value: value,
        tabIndex: tabIndex,
        type: 'checkbox',
        autoComplete: 'off',
        checked: Boolean(checked), // Keep input controlled: http://bit.ly/2eY7an2
        'aria-labelledby': labeledBy,
        onChange: disabled ? undefined : onChange,
      },
      _attrs,
    );
  },
});
