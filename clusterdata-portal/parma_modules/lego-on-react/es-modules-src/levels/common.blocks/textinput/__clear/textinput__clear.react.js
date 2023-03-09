var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import { decl, bool2string } from '@parma-lego/i-bem-react';
import "../../control/control.react.js";
import _control from "../../../desktop.blocks/control/control.react.js";

var Control = _control.applyDecls();

import "../../icon/icon.react.js";
import "../../icon/_glyph/icon_glyph.react.js";
import _icon_glyph_xSign from "../../icon/_glyph/icon_glyph_x-sign.react.js";

var Icon = _icon_glyph_xSign.applyDecls();

/*
import "./../../icon/icon.css";
import "./../../icon/_type/icon_type_cross.css";
import "./../../icon/_type/icon_type_cross-websearch.css";
import "./../../icon/_glyph/icon_glyph.css";
import "./../../icon/_glyph/icon_glyph_x-sign.css";


 */

export default decl(Control, {
    block: 'textinput',
    elem: 'clear',
    iconType: function iconType() {},
    iconGlyph: function iconGlyph() {},
    mods: function mods(_ref) {
        var theme = _ref.theme,
            visible = _ref.visible;

        return _extends({}, this.__base.apply(this, arguments), {
            theme: theme,
            visible: bool2string(visible)
        });
    },
    render: function render() {
        var block = this.block,
            elem = this.elem,
            _props = this.props,
            disabled = _props.disabled,
            size = _props.size;

        return React.createElement(Icon, {
            size: size,
            disabled: disabled,
            type: this.iconType(this.props),
            glyph: this.iconGlyph(this.props),
            attrs: this.attrs(this.props),
            mix: [{ block: block, elem: elem, mods: this.mods(this.props) }, { block: block, elem: 'icon' }]
        });
    }
});