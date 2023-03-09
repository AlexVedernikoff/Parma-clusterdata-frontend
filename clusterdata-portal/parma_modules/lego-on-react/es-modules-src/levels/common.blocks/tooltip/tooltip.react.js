var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';

import "../popup2/popup2.react.js";
import "../popup2/_theme/popup2_theme_normal.react.js";
import "../popup2/_target/popup2_target_anchor.react.js";
import "../popup2/_target/popup2_target_position.react.js";
import _popup2_autoclosable_yes from "../popup2/_autoclosable/popup2_autoclosable_yes.react.js";

var Popup = _popup2_autoclosable_yes.applyDecls();

/*
import "./../popup2/popup2.css";
import "./../popup2/_theme/popup2_theme_normal.css";
import "./../popup2/_theme/popup2_theme_clear.css";
import "./../popup2/_view/popup2_view_classic.css";
import "./../popup2/_view/popup2_view_default.css";
import "./../popup2/_tone/popup2_tone.css";
import "./../popup2/_tone/popup2_tone_default.css";
import "./../popup2/_tone/popup2_tone_grey.css";
import "./../popup2/_tone/popup2_tone_red.css";
import "./../popup2/_tone/popup2_tone_dark.css"; //eslint-disable-line
*/

import _tooltip__corner from "./__corner/tooltip__corner.react.js";

var Corner = _tooltip__corner.applyDecls();

/*
import "./__corner/tooltip__corner.css";
import "./__corner/_side/tooltip__corner_side_top-left.css";
import "./__corner/_side/tooltip__corner_side_top-right.css";
import "./__corner/_side/tooltip__corner_side_bottom-left.css";
import "./__corner/_side/tooltip__corner_side_bottom-right.css";
import "./__corner/_star/tooltip__corner_star_yes.css";
 */

import _tooltip__description from "./__description/tooltip__description.react.js";

var Description = _tooltip__description.applyDecls();

import _tooltip__buttons from "./__buttons/tooltip__buttons.react.js";

var Buttons = _tooltip__buttons.applyDecls();

import _tooltip__close from "./__close/tooltip__close.react.js";

var Close = _tooltip__close.applyDecls();

//import "./__close/tooltip__close.css";
//import "./../../desktop.blocks/tooltip/__close/tooltip__close.css";
import _popup2__tail from "../popup2/__tail/popup2__tail.react.js";

var PopupTail = _popup2__tail.applyDecls();

/*
import "./../popup2/__tail/popup2__tail.css";
import "./__backdrop/tooltip__backdrop.css";
import "./tooltip.css";
import "./../../desktop.blocks/tooltip/tooltip.css";
import "./../../desktop.blocks/tooltip/_hovered/tooltip_hovered_yes.css";
*/

export default decl({
    block: 'tooltip',
    willInit: function willInit() {
        this.state = {
            hovered: false
        };

        this.onMouseOver = this.onMouseOver.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);

        this._setInnerReference = this._setInnerReference.bind(this);
    },
    mods: function mods(_ref) {
        var size = _ref.size,
            theme = _ref.theme,
            view = _ref.view,
            tone = _ref.tone,
            autoclosable = _ref.autoclosable,
            visible = _ref.visible;

        return _extends({}, this.__base.apply(this, arguments), {
            size: size,
            view: view,
            tone: tone,
            theme: theme,
            autoclosable: autoclosable,
            shown: bool2string(visible),
            hovered: bool2string(this.state.hovered)
        });
    },
    render: function render() {
        var block = this.block,
            _props = this.props,
            anchor = _props.anchor,
            autoclosable = _props.autoclosable,
            popupProps = _props.popupProps,
            visible = _props.visible,
            view = _props.view,
            tone = _props.tone,
            theme = _props.theme,
            children = _props.children,
            secondaryOffset = _props.secondaryOffset,
            tailOffset = _props.tailOffset,
            scope = _props.scope,
            tail = _props.tail,
            cls = _props.cls,
            onOutsideClick = _props.onOutsideClick,
            zIndexGroupLevel = _props.zIndexGroupLevel;

        /*%%%ISLDEBUG%%%*/+0 && console.assert(this.props.offset === undefined, 'tooltip: Свойство offset является устаревшим, для указания отступа используйте mainOffset.');

        var mainOffset = this.props.mainOffset === undefined ? this.props.offset : this.props.mainOffset;
        var to = [].concat(this.props.to).map(function (direction) {
            if (direction.indexOf('-') < 0) {
                direction = direction + '-center';
            }
            return direction;
        });

        return React.createElement(
            Popup,
            _extends({
                view: view,
                tone: tone,
                mix: [].concat({ block: block, mods: this.mods(this.props) }, this.mix(this.props) || []),
                cls: cls,
                onMouseOver: this.onMouseOver,
                onMouseLeave: this.state.hovered ? this.onMouseLeave : undefined,
                theme: 'normal',
                target: 'anchor',
                onOutsideClick: onOutsideClick,
                visible: visible,
                mainOffset: mainOffset,
                secondaryOffset: theme === 'promo' ? -30 : secondaryOffset,
                tailOffset: theme === 'promo' ? 30 : tailOffset,
                directions: to,
                autoclosable: autoclosable,
                anchor: anchor,
                scope: scope,
                zIndexGroupLevel: zIndexGroupLevel,
                ref: this._setInnerReference,
                getTailRef: this.getTailRef
            }, popupProps),
            React.createElement(
                Bem,
                { block: 'tooltip', elem: 'backdrop' },
                tail && React.createElement(PopupTail, null)
            ),
            React.createElement(
                Bem,
                { block: 'tooltip', elem: 'content' },
                children
            )
        );
    },
    onMouseOver: function onMouseOver(e) {
        this.setState({ hovered: true });
        this.props.onMouseOver && this.props.onMouseOver(e);
    },
    onMouseLeave: function onMouseLeave(e) {
        this.setState({ hovered: false });
        this.props.onMouseLeave && this.props.onMouseLeave(e);
    },
    _setInnerReference: function _setInnerReference(popup) {
        this._popupRef = popup;
    }
}, {
    Corner: Corner,
    Description: Description,
    Buttons: Buttons,
    Close: Close,

    propTypes: {
        anchor: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
        autoclosable: PropTypes.bool,
        visible: PropTypes.bool,
        view: PropTypes.oneOf(['classic', 'default']),
        tone: PropTypes.string,
        to: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
        offset: PropTypes.number,
        mainOffset: PropTypes.number,
        secondaryOffset: PropTypes.number,
        tailOffset: PropTypes.number,
        size: PropTypes.oneOf(['xs', 's', 'm', 'l', 'n']),
        theme: PropTypes.oneOf(['normal', 'error', 'success', 'white', 'promo']),
        tail: PropTypes.bool,
        zIndexGroupLevel: PropTypes.number,
        onMouseOver: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onOutsideClick: PropTypes.func,
        cls: PropTypes.string,
        popupProps: PropTypes.object
    },
    defaultProps: {
        to: ['right-center', 'bottom-center', 'top-center', 'left-center'],
        tail: true,
        view: 'classic'
    }
});