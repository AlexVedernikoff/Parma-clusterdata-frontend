var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { declMod } from '@parma-lego/i-bem-react';

export default declMod({ type: 'check' }, {
    block: 'menu',
    willInit: function willInit(_ref) {
        var val = _ref.val;

        this.__base.apply(this, arguments);
        this.state.val = this._prepareVal(val);
        this.onClick = this.onClick.bind(this);
    },
    attrs: function attrs(_ref2) {
        var _ref2$tabIndex = _ref2.tabIndex,
            tabIndex = _ref2$tabIndex === undefined ? 0 : _ref2$tabIndex;

        return _extends({}, this.__base.apply(this, arguments), {
            'aria-multiselectable': 'true',
            role: 'listbox',
            tabIndex: tabIndex
        });
    },
    onClick: function onClick(e, val) {
        if (val !== null) {
            var oldVal = this.state.val;
            var newVal = oldVal.slice();

            var pos = oldVal.indexOf(val);

            pos === -1 ? newVal.push(val) : newVal.splice(pos, 1);

            this.setState({ val: newVal });
            this._onChange(newVal, oldVal);
        }

        this.props.onClick && this.props.onClick(e, val);
    }
});