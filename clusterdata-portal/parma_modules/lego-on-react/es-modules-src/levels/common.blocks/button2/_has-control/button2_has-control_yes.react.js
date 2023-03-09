var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React from 'react';
import { declMod } from '@parma-lego/i-bem-react';

import _button2__control from "../__control/button2__control.react.js";

var Control = _button2__control.applyDecls();

// import "./../__control/button2__control.css";


export default declMod(function (_ref) {
    var hasControl = _ref.hasControl;
    return hasControl;
}, {
    block: 'button2',
    tag: 'span',
    mods: function mods() {
        return _extends({}, this.__base.apply(this, arguments), {
            'has-control': 'yes'
        });
    },
    attrs: function attrs() {
        return _extends({}, this.__base.apply(this, arguments), {
            type: undefined,
            name: undefined,
            value: undefined,
            id: undefined,
            tabIndex: undefined,
            disabled: undefined,
            'aria-disabled': undefined,
            autoComplete: undefined
        });
    },
    content: function content(_ref2) {
        var id = _ref2.id,
            name = _ref2.name,
            value = _ref2.value,
            tabIndex = _ref2.tabIndex,
            disabled = _ref2.disabled,
            _ref2$control = _ref2.control,
            control = _ref2$control === undefined ? {} : _ref2$control;
        var attrs = control.attrs,
            type = control.type,
            mix = control.mix;

        var extendedAttrs = {};

        if (['checkbox', 'radio'].indexOf(type) >= 0) {
            extendedAttrs = {
                'aria-checked': this.state.checked || undefined,
                defaultChecked: this.state.checked || false
            };
        }

        return [].concat(_toConsumableArray(this.__base.apply(this, arguments)), [React.createElement(Control, _extends({ id: id, name: name, value: value, disabled: disabled, mix: mix, attrs: _extends({}, attrs, extendedAttrs), type: type }, {
            tabIndex: tabIndex,
            key: 'control' }))]);
    }
});