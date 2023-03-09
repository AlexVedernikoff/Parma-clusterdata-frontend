var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'button2',
    elem: 'control',
    tag: 'input',
    attrs: function attrs(_ref) {
        var type = _ref.type,
            id = _ref.id,
            name = _ref.name,
            value = _ref.value,
            disabled = _ref.disabled,
            tabindex = _ref.tabindex,
            _attrs = _ref.attrs;

        return _extends({
            autoComplete: 'off',
            disabled: disabled,
            'aria-disabled': disabled && 'true',
            type: type,
            id: id,
            name: name,
            value: value,
            tabIndex: tabindex
        }, _attrs);
    }
});