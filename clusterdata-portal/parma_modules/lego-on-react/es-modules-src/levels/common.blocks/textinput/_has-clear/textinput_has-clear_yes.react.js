var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';
import { declMod, bool2string } from '@parma-lego/i-bem-react';
import "../__clear/textinput__clear.react.js";
import "../__clear/_theme/textinput__clear_theme_normal.react.js";
import _textinput__clear_theme_websearch from "../__clear/_theme/textinput__clear_theme_websearch.react.js";

var TextInputClear = _textinput__clear_theme_websearch.applyDecls();

//import "./../__clear/textinput__clear.css";
//import "./../../../desktop.blocks/textinput/__clear/textinput__clear.css";
//import "./../__clear/_theme/textinput__clear_theme_websearch.css";
//import "./../__clear/_visible/textinput__clear_visible_yes.css";
import "../textinput.react.js";
import "../../../desktop.blocks/textinput/textinput.react.js";
import "../_has-icon/textinput_has-icon_yes.react.js";


var hasClear = function hasClear(props) {
    return (props.hasClear || props.theme === 'websearch') && !(props.controlAttrs && props.controlAttrs.readOnly);
};

export default declMod(hasClear, {
    block: 'textinput',
    mods: function mods(_ref) {
        var hasClear = _ref.hasClear;

        return _extends({}, this.__base.apply(this, arguments), {
            'has-clear': bool2string(hasClear),
            'has-icon': bool2string(hasClear)
        });
    },
    content: function content(_ref2) {
        var visible = _ref2.text,
            size = _ref2.size,
            view = _ref2.view,
            theme = _ref2.theme;
        var disabled = this.state.disabled;


        return [].concat(this.__base.apply(this, arguments), React.createElement(TextInputClear, {
            onClick: this._onClearClick.bind(this),
            onMouseDown: this._preventLosingFocus.bind(this),
            key: 'clear',
            view: view,
            disabled: disabled,
            visible: visible,
            theme: theme,
            size: size
        }));
    },
    _preventLosingFocus: function _preventLosingFocus(e) {
        if (this.state.focused) {
            e.preventDefault();
        }
    },
    _onClearClick: function _onClearClick(e) {
        this.focus();
        this.setState({ focused: true });

        this.props.onClearClick && this.props.onClearClick(e);

        if (!e.isDefaultPrevented()) {
            this.props.onChange('', this.props, { source: 'clear' });
        }
    }
}, {
    propTypes: {
        hasClear: PropTypes.bool
    }
});