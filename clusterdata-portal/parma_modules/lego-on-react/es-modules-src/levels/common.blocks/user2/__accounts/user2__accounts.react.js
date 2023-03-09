import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';
import "../../menu/__item/menu__item.react.js";
import _menu__item from "../../../desktop.blocks/menu/__item/menu__item.react.js";

var MenuItem = _menu__item.applyDecls();

import _userAccount from "../../user-account/user-account.react.js";

var UserAccount = _userAccount.applyDecls();

//import "./../../user-account/user-account.css";
//import "./../../../desktop.blocks/user-account/user-account.css";
import _userAccount__pic from "../../user-account/__pic/user-account__pic.react.js";

var UserAccountPic = _userAccount__pic.applyDecls();

//import "./../../user-account/__pic/user-account__pic.css";
import _userAccount__name from "../../user-account/__name/user-account__name.react.js";

var UserAccountName = _userAccount__name.applyDecls();

//import "./../../user-account/__name/user-account__name.css";
import _spin from "../../spin2/spin2.react.js";

var Spin = _spin.applyDecls();

/*
import "./../../spin2/spin2.css";
import "./../../../desktop.blocks/spin2/spin2.css";
import "./../../spin2/_progress/spin2_progress_yes.css";
import "./../../../desktop.blocks/spin2/_progress/spin2_progress_yes.css";
import "./../../spin2/_size/spin2_size_xs.css";
import "./../__add-account/user2__add-account.css";
*/

var i18n = function () {
    var core = require('bem-i18n');

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'ru' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'ru' : 'en' === 'ru') {
        return core().decl(require('../user2.i18n/ru'))('user2');
    }

    /*
    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
        return core().decl(require('./../user2.i18n/en'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
        return core().decl(require('./../user2.i18n/be'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
        return core().decl(require('./../user2.i18n/id'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
        return core().decl(require('./../user2.i18n/kk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
        return core().decl(require('./../user2.i18n/tr'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
        return core().decl(require('./../user2.i18n/tt'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
        return core().decl(require('./../user2.i18n/uk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
        return core().decl(require('./../user2.i18n/uz'))('user2');
    }*/

    if (process.env.NODE_ENV === 'development') {
        process.env.BEM_LANG && console.error('No match of process.env.BEM_LANG { ' + process.env.BEM_LANG + ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }');
        process.env.REACT_APP_BEM_LANG && console.error('No match of process.env.REACT_APP_BEM_LANG { ' + process.env.REACT_APP_BEM_LANG + ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }');
    }

    return function () {};
}();

export default decl({
    block: 'user2',
    elem: 'accounts',
    content: function content(_ref) {
        var retpathEncoded = _ref.retpathEncoded,
            addAccountHidden = _ref.addAccountHidden,
            mix = _ref.mix,
            children = _ref.children;
        var _props = this.props,
            passportHost = _props.passportHost,
            passportLinkParams = _props.passportLinkParams;

        var passportUrl = passportHost + '/auth?mode=add-user&retpath=' + retpathEncoded;

        if (passportLinkParams !== '') {
            passportUrl += '&' + passportLinkParams;
        }

        return [React.createElement(
            Bem,
            { key: 'accounts-container', block: this.block, elem: 'accounts-container' },
            this.processChildren(children)
        ),

        // Аккаунты оборачиваются в menu__item, чтобы можно было пользоваться его поведением (например, при hover)
        React.createElement(
            MenuItem,
            { key: 'add-account' },
            React.createElement(
                UserAccount,
                {
                    isAddAccount: true,
                    key: 'add-account',
                    url: passportUrl,
                    mix: [mix, { block: this.block, elem: 'add-account', mods: { hidden: bool2string(addAccountHidden) } }] },
                React.createElement(UserAccountPic, null),
                React.createElement(UserAccountName, { text: i18n('add-account') })
            )
        )];
    },
    processChildren: function processChildren(children) {
        var _this = this;

        // user2 должен знать о menu__item, в который обернут account
        if (children) {
            var registerItem = this.context.registerUserItem || function () {};

            return Children.map(children, function (child, i) {
                return React.createElement(
                    MenuItem,
                    {
                        type: 'account', key: '' + i,
                        ref: function ref(menuItem) {
                            return registerItem(child.props.uid, menuItem);
                        } },
                    cloneElement(child, {
                        provider: _this.props.provider,
                        avatarHost: _this.props.avatarHost,
                        plus: _this.context.isPlusAvailable && child.props.plus
                    })
                );
            });
        }

        if (this.props.fetchAccounts) {
            return React.createElement(Spin, { size: 'xs', progress: true, mix: { block: this.block, elem: 'accounts-spin' } });
        }
    }
}, {
    contextTypes: {
        isPlusAvailable: PropTypes.bool,
        registerUserItem: PropTypes.func
    }
});