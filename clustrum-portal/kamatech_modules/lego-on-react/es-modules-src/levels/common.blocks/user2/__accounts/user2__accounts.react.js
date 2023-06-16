import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../../menu/__item/menu__item.react.js';
import _menu__item from '../../../desktop.blocks/menu/__item/menu__item.react.js';

var MenuItem = _menu__item.applyDecls();

import _userAccount from '../../user-account/user-account.react.js';

var UserAccount = _userAccount.applyDecls();

//import "./../../user-account/user-account.css";
//import "./../../../desktop.blocks/user-account/user-account.css";
import _userAccount__pic from '../../user-account/__pic/user-account__pic.react.js';

var UserAccountPic = _userAccount__pic.applyDecls();

//import "./../../user-account/__pic/user-account__pic.css";
import _userAccount__name from '../../user-account/__name/user-account__name.react.js';

var UserAccountName = _userAccount__name.applyDecls();

//import "./../../user-account/__name/user-account__name.css";
import _spin from '../../spin2/spin2.react.js';

var Spin = _spin.applyDecls();

/*
import "./../../spin2/spin2.css";
import "./../../../desktop.blocks/spin2/spin2.css";
import "./../../spin2/_progress/spin2_progress_yes.css";
import "./../../../desktop.blocks/spin2/_progress/spin2_progress_yes.css";
import "./../../spin2/_size/spin2_size_xs.css";
import "./../__add-account/user2__add-account.css";
*/

export default decl(
  {
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

      return [
        React.createElement(
          Bem,
          { key: 'accounts-container', block: this.block, elem: 'accounts-container' },
          this.processChildren(children),
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
              mix: [
                mix,
                {
                  block: this.block,
                  elem: 'add-account',
                  mods: { hidden: bool2string(addAccountHidden) },
                },
              ],
            },
            React.createElement(UserAccountPic, null),
            React.createElement(UserAccountName, { text: 'Добавить аккаунт' }),
          ),
        ),
      ];
    },
    processChildren: function processChildren(children) {
      var _this = this;

      // user2 должен знать о menu__item, в который обернут account
      if (children) {
        var registerItem = this.context.registerUserItem || function() {};

        return Children.map(children, function(child, i) {
          return React.createElement(
            MenuItem,
            {
              type: 'account',
              key: '' + i,
              ref: function ref(menuItem) {
                return registerItem(child.props.uid, menuItem);
              },
            },
            cloneElement(child, {
              provider: _this.props.provider,
              avatarHost: _this.props.avatarHost,
              plus: _this.context.isPlusAvailable && child.props.plus,
            }),
          );
        });
      }

      if (this.props.fetchAccounts) {
        return React.createElement(Spin, {
          size: 'xs',
          progress: true,
          mix: { block: this.block, elem: 'accounts-spin' },
        });
      }
    },
  },
  {
    contextTypes: {
      isPlusAvailable: PropTypes.bool,
      registerUserItem: PropTypes.func,
    },
  },
);
