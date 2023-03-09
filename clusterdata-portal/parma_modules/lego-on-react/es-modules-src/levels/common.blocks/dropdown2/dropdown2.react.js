var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _class2, _temp2;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';
import "../popup2/popup2.react.js";
import "../popup2/_theme/popup2_theme_normal.react.js";
import "../popup2/_target/popup2_target_anchor.react.js";
import _popup2_autoclosable_yes from "../popup2/_autoclosable/popup2_autoclosable_yes.react.js";

var Popup = _popup2_autoclosable_yes.applyDecls();

/*
import "./../popup2/popup2.css";
import "./../popup2/_theme/popup2_theme_normal.css";

 */


export default decl({
    block: 'dropdown2',
    willInit: function willInit() {
        this.__base.apply(this, arguments);

        this.state = {};

        this._onSwitcherClick = this._onSwitcherClick.bind(this);
        this._onOutsideClick = this._onOutsideClick.bind(this);
        this.switcherReference = this.switcherReference.bind(this);
    },
    content: function content(_ref) {
        var children = _ref.children,
            view = _ref.view,
            tone = _ref.tone,
            theme = _ref.theme,
            size = _ref.size,
            disabled = _ref.disabled,
            hasTail = _ref.hasTail,
            hasTick = _ref.hasTick;

        var switcher = void 0,
            popup = void 0,
            pseudo = void 0,
            inner = void 0,
            url = void 0,
            mix = void 0;

        Children.forEach(children, function (item) {
            if (isSwitcher(item)) {
                switcher = item.props.children;
                url = item.props.url;
                mix = item.props.mix;
                pseudo = item.props.pseudo;
                inner = item.props.inner;
            }

            if (isPopup(item)) {
                popup = item.props.children;
            }
        });

        if (_typeof(this.props.switcher) === 'object') {
            this.__switcher = this.props.switcher;

            // FUCKing magic
            this.props = _extends({}, this.props);
            this.props.switcher = Object(this.__switcher.type).prototype.block;

            switcher = this.__switcher.props.children || this.__switcher.props.text;
            url = this.__switcher.props.url;
            mix = this.__switcher.props.mix;
            pseudo = this.__switcher.props.pseudo;
            inner = this.__switcher.props.inner;
        }

        if (_typeof(this.props.popup) === 'object') {
            this.__popup = this.props.popup;
            popup = this.__popup.props.children;
        }

        var content = [this._renderSwitcher({
            view: view,
            tone: tone,
            size: size,
            theme: theme,
            pseudo: pseudo,
            inner: inner,
            hasTick: hasTick,
            disabled: disabled,
            mix: mix,
            url: url,
            children: switcher,
            onClick: this._onSwitcherClick,
            ref: this.switcherReference
        }), !disabled && this._renderPopup({ view: view, tone: tone, hasTail: hasTail, children: popup })];

        if (this.__switcher) {
            // FIX FUCKing magic for React-16
            this.props.switcher = this.__switcher;
        }

        return content;
    },
    _renderSwitcher: function _renderSwitcher() {},
    _renderPopup: function _renderPopup(_ref2) {
        var view = _ref2.view,
            tone = _ref2.tone,
            hasTail = _ref2.hasTail,
            zIndexGroupLevel = _ref2.zIndexGroupLevel,
            children = _ref2.children;
        var visible = this.state.opened;

        return React.createElement(
            Popup,
            _extends({
                view: view,
                tone: tone,
                theme: 'normal',
                hasTail: hasTail
            }, Object(this.__popup).props || {}, {
                visible: visible,
                zIndexGroupLevel: zIndexGroupLevel,
                key: 'popup',
                autoclosable: true,
                anchor: this.switcherReference,
                onOutsideClick: this._onOutsideClick
            }),
            children
        );
    },
    _onSwitcherClick: function _onSwitcherClick(e) {
        this.setState({ opened: !this.state.opened });
    },
    _onOutsideClick: function _onOutsideClick(e) {
        this.setState({ opened: false });
    },
    switcherReference: function switcherReference(switcher) {
        if (switcher === undefined) {
            return this._switcher;
        }
        this._switcher = switcher;
    }
}, {
    Switcher: (_temp = _class = function (_Component) {
        _inherits(Switcher, _Component);

        function Switcher() {
            _classCallCheck(this, Switcher);

            return _possibleConstructorReturn(this, (Switcher.__proto__ || Object.getPrototypeOf(Switcher)).apply(this, arguments));
        }

        _createClass(Switcher, [{
            key: 'render',
            // eslint-disable-line react/no-multi-comp
            // Not a part of standard
            value: function render() {
                return this.props.children;
            }
        }]);

        return Switcher;
    }(Component), _class.__name = 'Switcher', _temp),
    Popup: (_temp2 = _class2 = function (_Component2) {
        _inherits(Popup, _Component2);

        function Popup() {
            _classCallCheck(this, Popup);

            return _possibleConstructorReturn(this, (Popup.__proto__ || Object.getPrototypeOf(Popup)).apply(this, arguments));
        }

        _createClass(Popup, [{
            key: 'render',
            // eslint-disable-line react/no-multi-comp
            // Not a part of standard
            value: function render() {
                return this.props.children;
            }
        }]);

        return Popup;
    }(Component), _class2.__name = 'Popup', _temp2),
    propTypes: {
        onChange: PropTypes.func,
        view: PropTypes.string,
        tone: PropTypes.string,
        theme: PropTypes.string.isRequired,
        hasTail: PropTypes.bool,
        disabled: PropTypes.bool,
        zIndexGroupLevel: PropTypes.number,
        size: PropTypes.oneOf(['xs', 's', 'm', 'n']),
        width: PropTypes.oneOf(['fixed', 'max']),
        switcher: PropTypes.oneOfType([PropTypes.oneOf(['button', 'button2', 'link']), PropTypes.element]),
        popup: PropTypes.element,
        hasTick: PropTypes.bool
    },
    defaultProps: {
        view: 'classic',
        hasTick: false
    }
});

function isSwitcher(child) {
    return child && typeof child.type === 'function' && child.type.__name === 'Switcher';
}

function isPopup(child) {
    return child && typeof child.type === 'function' && child.type.__name === 'Popup';
}