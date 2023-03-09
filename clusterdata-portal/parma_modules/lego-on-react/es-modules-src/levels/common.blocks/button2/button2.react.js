var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@parma-lego/i-bem-react';

import "../control/control.react.js";
import _control from "../../desktop.blocks/control/control.react.js";

var Control = _control.applyDecls();

import _icon from "../icon/icon.react.js";

var Icon = _icon.applyDecls();

// import "./../icon/icon.css";
import _keycodes from "../keycodes/keycodes.react.js";

var Keys = _keycodes.applyDecls();

import _button2__text from "./__text/button2__text.react.js";

var ButtonText = _button2__text.applyDecls();

// import "./__text/button2__text.css";
import _button2__icon from "./__icon/button2__icon.react.js";

var ButtonIcon = _button2__icon.applyDecls();

// import "./__icon/button2__icon.css";


export default decl(Control, {
    block: 'button2',
    willInit: function willInit(_ref) {
        var checked = _ref.checked,
            progress = _ref.progress;

        this.__base.apply(this, arguments);
        this.defaultPressKeys = ['SPACE', 'ENTER'];
        this.defaultPrvntKeys = [];
        this.state.checked = checked;
        progress && (this.state.disabled = progress);

        this.onKeyPress = this.onKeyPress.bind(this);
        this.setReference = this.setReference.bind(this);
    },
    tag: function tag(_ref2) {
        var _tag = _ref2.tag;

        return _tag || 'button';
    },
    willReceiveProps: function willReceiveProps(_ref3) {
        var disabled = _ref3.disabled,
            checked = _ref3.checked,
            progress = _ref3.progress,
            pressed = _ref3.pressed,
            focused = _ref3.focused;

        this.__base.apply(this, arguments);

        if (progress !== this.props.progress) {
            /**
             * Задаем disabled через state, т.к. нам нужно,
             * чтобы произошел ре-рендер и удалились ненужные модификаторы
             */
            this.setState({ disabled: disabled || progress });
        }
        if (!disabled && pressed !== this.props.pressed) {
            this.setState({ pressed: pressed });
        }
        if (focused !== this.props.focused) {
            this.setState({
                focused: focused,
                pressed: focused && pressed
            });
        }
        if (checked !== this.props.checked) {
            this.setState({ checked: checked });
        }
    },
    willUpdate: function willUpdate(nextProps) {
        this.__base.apply(this, arguments);

        if (this.control && nextProps.focused && !this.state.focused) {
            this.control.focus();
        }
    },
    mods: function mods(_ref4) {
        var view = _ref4.view,
            tone = _ref4.tone,
            size = _ref4.size,
            theme = _ref4.theme,
            pin = _ref4.pin,
            pale = _ref4.pale,
            width = _ref4.width,
            progress = _ref4.progress,
            action = _ref4.action,
            baseline = _ref4.baseline;
        var _state = this.state,
            disabled = _state.disabled,
            checked = _state.checked;


        return _extends({}, this.__base.apply(this, arguments), {
            view: view,
            tone: tone,
            size: size,
            theme: theme,
            pin: pin,
            width: width,
            action: bool2string(action),
            baseline: bool2string(baseline),
            pale: bool2string(pale),
            checked: bool2string(checked),
            disabled: bool2string(disabled),
            progress: bool2string(progress)
        });
    },
    attrs: function attrs(_ref5) {
        var title = _ref5.title,
            id = _ref5.id,
            name = _ref5.name,
            val = _ref5.val,
            tabIndex = _ref5.tabIndex,
            style = _ref5.style,
            _attrs = _ref5.attrs,
            progress = _ref5.progress;
        var _state2 = this.state,
            disabled = _state2.disabled,
            checked = _state2.checked;

        return _extends({}, this.__base.apply(this, arguments), {
            id: id,
            title: title,
            name: name,
            style: style,
            disabled: disabled,
            value: val,
            type: 'button', // По умолчанию браузеры выставляют у <button> тип submit.
            autoComplete: 'off',
            'aria-pressed': checked,
            tabIndex: disabled ? undefined : tabIndex,
            'aria-disabled': disabled,
            onKeyPress: disabled ? undefined : this.onKeyPress,
            ref: this.setReference
        }, _attrs);
    },
    content: function content(_ref6) {
        var size = _ref6.size,
            textAttrs = _ref6.textAttrs,
            text = _ref6.text,
            icon = _ref6.icon,
            iconLeft = _ref6.iconLeft,
            iconRight = _ref6.iconRight,
            children = _ref6.children;

        var content = [];
        var textElems = [];
        Children.forEach(children, function (child, i) {
            if (Children.count(children) === 1 && Icon.isIcon(child)) {
                content.unshift(React.createElement(ButtonIcon, { key: 'only-icon', size: size, children: child }));
            } else if (Icon.isIcon(child) && i === 0) {
                content.unshift(React.createElement(ButtonIcon, { key: 'icon-left', side: 'left', size: size, children: child }));
            } else if (Icon.isIcon(child) && content.length) {
                content.unshift(React.createElement(ButtonIcon, { key: 'icon-right', side: 'right', size: size, children: child }));
            } else if (child) {
                // Undifined protection
                if (!textElems.length) {
                    content.push(React.createElement(
                        ButtonText,
                        { key: 'text', attrs: textAttrs },
                        textElems
                    ));
                }
                textElems.push(child);
            }
        });
        if (text) {
            if (!textElems.length) {
                content.push(React.createElement(
                    ButtonText,
                    { key: 'text', attrs: textAttrs },
                    textElems
                ));
            }
            textElems.push(text);
        }
        icon && content.unshift(React.createElement(ButtonIcon, { key: 'only-icon', size: size, children: Icon.isIcon(icon) ? icon : React.createElement(Icon, icon.mods) }));
        iconRight && content.unshift(React.createElement(ButtonIcon, { key: 'icon-right', side: 'right', size: size, children: Icon.isIcon(iconRight) ? iconRight : React.createElement(Icon, iconRight.mods) }));
        iconLeft && content.unshift(React.createElement(ButtonIcon, { key: 'icon-left', side: 'left', size: size, children: Icon.isIcon(iconLeft) ? iconLeft : React.createElement(Icon, iconLeft.mods) }));
        return content;
    },
    onKeyDown: function onKeyDown(e) {
        if (Keys.is(e.keyCode, this.props.pressKeys || this.defaultPressKeys)) {
            this.setState({ pressed: true });

            if (Keys.is(e.keyCode, this.props.prvntKeys || this.defaultPrvntKeys)) {
                e.preventDefault();
            }
        }
        this.__base.apply(this, arguments);
    },
    onKeyUp: function onKeyUp(e) {
        if (Keys.is(e.keyCode, this.props.prvntKeys || this.defaultPrvntKeys)) {
            e.preventDefault();
        }

        if (Keys.is(e.keyCode, this.props.pressKeys || this.defaultPressKeys)) {
            this.setState({ pressed: false });
        }
        this.__base.apply(this, arguments);
    },
    onKeyPress: function onKeyPress(e) {
        this.props.onKeyPress && this.props.onKeyPress(e);
    },
    onClick: function onClick(e) {
        this.control && this.control.focus();
        this.__base.apply(this, arguments);
    },
    setReference: function setReference(control) {
        this.control = control;
        this.props.innerRef && this.props.innerRef(control);
    },
    onMouseDown: function onMouseDown(event) {
        this.__base.apply(this, arguments);
        event.preventDefault();
    }
}, {
    propTypes: {
        baseline: PropTypes.bool,
        theme: PropTypes.string.isRequired,
        size: PropTypes.oneOf(['ns', 'xs', 's', 'm', 'l', 'n', 'head']),
        id: PropTypes.string,
        name: PropTypes.string,
        title: PropTypes.string,
        tabIndex: PropTypes.number,
        text: PropTypes.string,
        type: PropTypes.string,
        iconLeft: PropTypes.object,
        iconRight: PropTypes.object,
        onClick: PropTypes.func,
        progress: PropTypes.bool,
        action: PropTypes.bool,
        pale: PropTypes.bool,
        checked: PropTypes.bool,
        innerRef: PropTypes.func,
        pressKeys: PropTypes.arrayOf(PropTypes.oneOf(Keys.list())),
        prvntKeys: PropTypes.arrayOf(PropTypes.oneOf(Keys.list()))
    },
    defaultProps: {
        view: 'classic'
    }
});