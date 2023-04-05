import { decl } from '@parma-lego/i-bem-react';

export default decl({
  block: 'radiobox',
  elem: 'control',
  tag: 'input',
  attrs: function attrs(_ref) {
    var id = _ref.id,
      name = _ref.name,
      value = _ref.value,
      onChange = _ref.onChange,
      checked = _ref.checked,
      disabled = _ref.disabled,
      tabIndex = _ref.tabIndex;

    return {
      id: id,
      name: name,
      value: value,
      checked: checked,
      disabled: disabled,
      onChange: disabled ? undefined : onChange,
      type: 'radio',
      tabIndex: disabled ? -1 : tabIndex,
    };
  },
});
