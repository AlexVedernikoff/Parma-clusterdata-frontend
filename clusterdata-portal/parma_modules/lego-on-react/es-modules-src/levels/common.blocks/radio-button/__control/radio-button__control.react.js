import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';

export default decl({
    block: 'radio-button',
    elem: 'control',
    tag: 'input',
    attrs: function attrs(_ref) {
        var disabled = _ref.disabled,
            id = _ref.id,
            name = _ref.name,
            checked = _ref.checked,
            value = _ref.value,
            onChange = _ref.onChange,
            innerRef = _ref.innerRef,
            tabIndex = _ref.tabIndex;

        return {
            type: 'radio',
            tabIndex: disabled ? -1 : tabIndex,
            ref: innerRef,
            checked: checked,
            disabled: disabled,
            onChange: onChange,
            value: value,
            name: name,
            id: id
        };
    }
}, {
    propTypes: {
        innerRef: PropTypes.func
    }
});