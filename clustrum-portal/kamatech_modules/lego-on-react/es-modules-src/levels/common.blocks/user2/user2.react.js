var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Bem, { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../button2/button2.react.js';
import _button2_type_link from '../button2/_type/button2_type_link.react.js';

var Button = _button2_type_link.applyDecls();

/*
import "./../button2/button2.css";
import "./../../desktop.blocks/button2/button2.css";
import "./../button2/_theme/button2_theme_pseudo.css";
import "./../../desktop.blocks/button2/_theme/button2_theme_pseudo.css";
import "./../button2/_size/button2_size_m.css";
 */

import '../user-account/user-account.react.js';
import '../user-account/_has-accent-letter/user-account_has-accent-letter_yes.react.js';
import _userAccount_hasTicker_yes from '../user-account/_has-ticker/user-account_has-ticker_yes.react.js';

var UserAccount = _userAccount_hasTicker_yes.applyDecls();

//import "./../user-account/user-account.css";
//import "./../../desktop.blocks/user-account/user-account.css";
//import "./../user-account/_has-subname/user-account_has-subname_yes.css";
import _link from '../link/link.react.js';

var Link = _link.applyDecls();

/*
import "./../link/link.css";
import "./../../desktop.blocks/link/link.css";
import "./../link/_theme/link_theme_pseudo.css";
import "./../../deskpad.blocks/link/_theme/link_theme_pseudo.css";
import "./../../desktop.blocks/link/_theme/link_theme_pseudo.css";
 */

import '../popup2/popup2.react.js';
import '../popup2/_theme/popup2_theme_normal.react.js';
import '../popup2/_target/popup2_target_anchor.react.js';
import _popup2_autoclosable_yes from '../popup2/_autoclosable/popup2_autoclosable_yes.react.js';

var Popup = _popup2_autoclosable_yes.applyDecls();

/*
import "./../popup2/popup2.css";
import "./../popup2/_theme/popup2_theme_normal.css";
 */

import '../menu/menu.react.js';
import '../../desktop.blocks/menu/menu.react.js';
import _menu_type_navigation from '../menu/_type/menu_type_navigation.react.js';

var Menu = _menu_type_navigation.applyDecls();

//import "./../menu/menu.css";
//import "./../menu/_theme/menu_theme_normal.css";
import _menu__group from '../menu/__group/menu__group.react.js';

var MenuGroup = _menu__group.applyDecls();

import './__menu-item/user2__menu-item.react.js';

//import "./__menu-item/_action/user2__menu-item_action_plus.css";
//import "./__menu/user2__menu.css"; // Стили user2__menu  не должны перебивать стили user2__multi-auth.

//import "./__multi-auth/user2__multi-auth.css";
//import "./../../desktop.blocks/user2/__multi-auth/user2__multi-auth.css";
//import "./__accounts-spin/user2__accounts-spin.css";
import _user2__accounts from './__accounts/user2__accounts.react.js';

var UserAccounts = _user2__accounts.applyDecls();

//import "./__accounts/user2__accounts.css";
import _user2__menuFooter from './__menu-footer/user2__menu-footer.react.js';

var UserMenuFooter = _user2__menuFooter.applyDecls();

//import "./../a11y-hidden/a11y-hidden.css";
//import "./__enter/user2__enter.css";

var i18n = (function () {
  var core = require('bem-i18n');

  if (
    process.env.BEM_LANG
      ? process.env.BEM_LANG === 'ru'
      : process.env.REACT_APP_BEM_LANG
        ? process.env.REACT_APP_BEM_LANG === 'ru'
        : 'en' === 'ru'
  ) {
    return core().decl(require('./user2.i18n/ru'))('user2');
  }

  /*
    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'en' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'en' : 'en' === 'en') {
        return core().decl(require('./user2.i18n/en'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'be' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'be' : 'en' === 'be') {
        return core().decl(require('./user2.i18n/be'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'id' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'id' : 'en' === 'id') {
        return core().decl(require('./user2.i18n/id'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'kk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'kk' : 'en' === 'kk') {
        return core().decl(require('./user2.i18n/kk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tr' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tr' : 'en' === 'tr') {
        return core().decl(require('./user2.i18n/tr'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'tt' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'tt' : 'en' === 'tt') {
        return core().decl(require('./user2.i18n/tt'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uk' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uk' : 'en' === 'uk') {
        return core().decl(require('./user2.i18n/uk'))('user2');
    }

    if (process.env.BEM_LANG ? process.env.BEM_LANG === 'uz' : process.env.REACT_APP_BEM_LANG ? process.env.REACT_APP_BEM_LANG === 'uz' : 'en' === 'uz') {
        return core().decl(require('./user2.i18n/uz'))('user2');
    }
     */

  if (process.env.NODE_ENV === 'development') {
    process.env.BEM_LANG &&
      console.error(
        'No match of process.env.BEM_LANG { ' +
        process.env.BEM_LANG +
        ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
    process.env.REACT_APP_BEM_LANG &&
      console.error(
        'No match of process.env.REACT_APP_BEM_LANG { ' +
        process.env.REACT_APP_BEM_LANG +
        ' } in provided langs: { ru, en, be, id, kk, tr, tt, uk, uz }',
      );
  }

  return function () { };
})();

import '../user-hat/user-hat.react.js';
import _userHat_fetchData_yes from '../user-hat/_fetch-data/user-hat_fetch-data_yes.react.js';

var UserHat = _userHat_fetchData_yes.applyDecls();

/*
import "./../user-hat/user-hat.css";
import "./../../desktop.blocks/user-hat/user-hat.css";
 */

export default decl(
  {
    block: 'user2',
    willInit: function willInit(_ref) {
      var _ref$hat = _ref.hat,
        hat = _ref$hat === undefined ? {} : _ref$hat;

      this.state = {
        hatReady: false,
        hatVisible: !hat.fetchData,
        maxHeight: '',
        opened: false,
        plusItemVisible: true,
      };

      this.accounts = [];
      this.onCurrentAccountClick = this.onCurrentAccountClick.bind(this);
      this.onCurrentAccountMouseOver = this.onCurrentAccountMouseOver.bind(this);

      this.onOutsideClick = this.onOutsideClick.bind(this);
      this.userAccountReference = this.userAccountReference.bind(this);
      this._processLogout = this._processLogout.bind(this);

      this._onLogin = this._onLogin.bind(this);
      this._onLogout = this._onLogout.bind(this);
      this._onMenuItemClick = this._onMenuItemClick.bind(this);

      this._setReference = this._setReference.bind(this);
      this._setMaxHeight = this._setMaxHeight.bind(this);
      this.onHatCloseClick = this.onHatCloseClick.bind(this);

      this.onSuccess = this.onSuccess.bind(this);

      this.items = {};
    },
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        ref: this._setReference,
      });
    },
    willUpdate: function willUpdate(nextProps, nextState) {
      if (nextState.opened && !this.state.opened) {
        this._setMaxHeight();
        window.addEventListener('resize', this._setMaxHeight);
      } else if (this.state.opened && !nextState.opened) {
        window.removeEventListener('resize', this._setMaxHeight);
      }
    },
    didMount: function didMount() {
      this._setMaxHeight();
    },
    willUnmount: function willUnmount() {
      window.removeEventListener('resize', this._setMaxHeight);
    },
    getChildContext: function getChildContext() {
      var processLogout = this.props.processLogout || this.props.hasLogout ? this._processLogout : undefined;
      var attributes = this.props.accountAttributes;

      // Здесь не нужен undefined, user-account и user-pic проверяют на falsy.
      var plus = attributes.has_plus || attributes.plus_available;

      return {
        isPlusAvailable: plus,
        changeUser: this._changeUser.bind(this),
        registerUserItem: this._registerItem.bind(this),
        menuItems: this.items,
        processLogout: processLogout,
      };
    },
    mods: function mods(_ref2) {
      var hasLogout = _ref2.hasLogout,
        processLogout = _ref2.processLogout,
        provider = _ref2.provider,
        hat = _ref2.hat;

      return {
        provider: provider,
        'has-hat': bool2string(hat),
        opened: bool2string(this.state.opened),
        'has-logout': hasLogout || processLogout ? 'yes' : false,
      };
    },
    content: function content(_ref3) {
      var uid = _ref3.uid,
        hat = _ref3.hat,
        yu = _ref3.yu,
        name = _ref3.name,
        yaplus = _ref3.yaplus,
        unreadCount = _ref3.unreadCount,
        avatarId = _ref3.avatarId,
        avatarHost = _ref3.avatarHost,
        contentRegion = _ref3.contentRegion,
        fetchAccounts = _ref3.fetchAccounts,
        plusLinkParams = _ref3.plusLinkParams,
        hasAccentLetter = _ref3.hasAccentLetter,
        addAccountHidden = _ref3.addAccountHidden,
        accountAttributes = _ref3.accountAttributes,
        popup = _ref3.popup,
        actionsMenu = _ref3.actionsMenu,
        multiAuthMenu = _ref3.multiAuthMenu,
        children = _ref3.children,
        accounts = _ref3.accounts,
        pic = _ref3.pic,
        settingsUrl = _ref3.settingsUrl,
        helpUrl = _ref3.helpUrl,
        subname = _ref3.subname,
        provider = _ref3.provider,
        passportLinkParams = _ref3.passportLinkParams,
        maxLength = _ref3.maxLength;
      var block = this.block;

      var passportHost = this._getPassportHost();

      // true, если has_plus === true
      // false, если has_plus === undefined && attributes.plus_available
      // иначе undefined
      var plus = accountAttributes.has_plus || (accountAttributes.plus_available && false);

      if (avatarId === undefined) {
        avatarId = pic && pic.avatarId;
      }
      accounts && (children = accounts);

      var retpathEncoded = encodeURIComponent(this._getRetpath());
      if (!uid) {
        var title = i18n('enter');
        var enterUrl = passportHost + '/auth?retpath=' + retpathEncoded;

        if (passportLinkParams !== '') {
          enterUrl += '&' + passportLinkParams;
        }

        return React.createElement(
          Button,
          {
            size: 'm',
            theme: 'pseudo',
            type: 'link',
            onClick: this._onLogin,
            url: enterUrl,
            mix: { block: block, elem: 'enter' },
            iconLeft: { mix: { block: block, elem: 'enter-icon' } },
            tabIndex: -1,
            title: title,
          },
          title,
        );
      }

      if (!name && name !== false) {
        name = uid;
      }

      // eslint-disable-next-line max-len
      var exitUrl =
        passportHost +
        '/passport?mode=embeddedauth&action=logout&yu=' +
        yu +
        '&uid=' +
        uid +
        '&retpath=' +
        retpathEncoded;
      var accountUrl = passportHost;

      if (passportLinkParams !== '') {
        accountUrl += '?' + passportLinkParams;
      }

      // Для обратной совместимости переносим потенциально добавленный пользователем пункт
      // c Плюсом в конец. Проверка на undefined и фильтр по Boolean - в методе _renderMenuItems.
      var plusItem = { action: 'plus' };

      actionsMenu = actionsMenu
        .filter(function (item) {
          if (item.action === 'plus') {
            plusItem = _extends({}, plusItem, item);
            return false;
          }

          return item;
        })
        .concat(plusItem);

      return [
        React.createElement(UserAccount, {
          plus: plus,
          isCurrent: true,
          provider: provider,
          key: 'current-account',
          hasAccentLetter: hasAccentLetter,
          mix: { block: block, elem: 'current-account' },
          name: name,
          maxLength: maxLength,
          url: accountUrl,
          hasTicker: avatarId !== false && unreadCount ? true : undefined,
          tickerCount: unreadCount,
          avatarId: avatarId,
          avatarHost: avatarHost,
          pic: Boolean(pic) || avatarId !== false,
          ref: this.userAccountReference,
          onMouseOver: this.onCurrentAccountMouseOver,
          onClick: this.onCurrentAccountClick,
        }),
        React.createElement(
          Link,
          {
            key: 'a11y-exit',
            theme: 'pseudo',
            attrs: { accessKey: 'x' },
            tabIndex: '-1',
            mix: [{ block: block, elem: 'a11y-exit' }, { block: 'a11y-hidden' }],
            url: exitUrl,
          },
          i18n('exit'),
        ),
        React.createElement(
          Popup,
          _extends(
            {
              key: 'popup',
              mainOffset: -46,
              secondaryOffset: -2,
              visible: this.state.opened,
              directions: ['bottom-right'],
              target: 'anchor',
              theme: 'normal',
              autoclosable: true,
              anchor: this.userAccountReference,
              onOutsideClick: this.onOutsideClick,
              mix: { block: block, elem: 'popup' },
            },
            popup,
          ),
          React.createElement(
            Menu,
            {
              theme: 'special-user2',
              type: 'navigation',
              nowrap: true,
              style: { maxHeight: this.state.maxHeight },
              mix: { block: block, elem: 'menu' },
            },
            hat &&
            yaplus === false &&
            React.createElement(
              UserHat,
              _extends(
                {
                  onCloseButtonClick: this.onHatCloseClick,
                  onSuccess: this.onSuccess,
                  ready: this.state.hatReady,
                  hidden: !this.state.hatVisible,
                },
                hat,
              ),
            ),
            React.createElement(
              Bem,
              { block: 'user2', elem: 'menu-header' },
              React.createElement(UserAccount, {
                pic: true,
                plus: plus,
                isCurrent: true,
                provider: provider,
                mix: { block: 'user2', elem: 'account' },
                name: name,
                maxLength: maxLength,
                subname: subname,
                avatarId: avatarId || undefined,
                avatarHost: avatarHost,
              }),
            ),
            React.createElement(
              MenuGroup,
              { key: 'menu-group', isNavigation: true },
              this._renderMenuItems([].concat(_toConsumableArray(actionsMenu), _toConsumableArray(multiAuthMenu)), {
                unreadCount: unreadCount,
                plus: yaplus,
                plusLinkParams: plusLinkParams,
                exitUrl: exitUrl,
                retpathEncoded: retpathEncoded,
                passportHost: passportHost,
                contentRegion: contentRegion,
                passportLinkParams: passportLinkParams,
              }),
            ),
            React.createElement(
              Bem,
              { block: this.block, elem: 'multi-auth' },
              React.createElement(
                UserAccounts,
                {
                  provider: provider,
                  passportHost: passportHost,
                  passportLinkParams: passportLinkParams,
                  retpathEncoded: retpathEncoded,
                  addAccountHidden: addAccountHidden,
                  fetchAccounts: fetchAccounts,
                  maxLength: maxLength,
                  avatarHost: avatarHost,
                },
                children,
              ),
            ),
            React.createElement(UserMenuFooter, {
              settingsUrl: settingsUrl,
              helpUrl: helpUrl,
              contentRegion: contentRegion,
            }),
          ),
        ),
      ];
    },
    onCurrentAccountClick: function onCurrentAccountClick(e) {
      if (this._isBannerReady && !this._isClosed) {
        this.setState({
          hatVisible: true,
          plusItemVisible: false,
        });
      }

      if (this._isClosed) {
        this.setState({
          plusItemVisible: true,
        });
      }
      e.preventDefault();
      this.setState({ opened: !this.state.opened });
      this.props.onCurrentAccountClick && this.props.onCurrentAccountClick(e);
    },
    onCurrentAccountMouseOver: function onCurrentAccountMouseOver(e) {
      this.setState({ hatReady: true });

      if (this._isClosed) {
        this.setState({ plusItemVisible: true });
      } else {
        this._isBannerReady &&
          this.setState({
            hatVisible: true,
            plusItemVisible: false,
          });
      }
    },
    onOutsideClick: function onOutsideClick() {
      this.setState({ opened: false });
    },
    onHatCloseClick: function onHatCloseClick() {
      this.setState({ hatVisible: false });
      this._isClosed = true;
    },
    _changeUser: function _changeUser(e, uid) {
      if (this.isLogoutClick) {
        this.isLogoutClick = false;
        return;
      }

      var passportHost = this._getPassportHost();
      var retpath = this._getRetpath();
      // Чтобы сменить текущего пользователя, нужно отправить именно форму POST-запросом.
      var formContainer = document.createElement('div');
      document.body.appendChild(formContainer);
      var action = passportHost + '/passport?mode=embeddedauth';
      var form = React.createElement(
        'form',
        { action: action, method: 'post' },
        React.createElement('input', { type: 'hidden', name: 'action', value: 'change_default' }),
        React.createElement('input', { type: 'hidden', name: 'uid', value: uid }),
        React.createElement('input', { type: 'hidden', name: 'retpath', value: retpath }),
        React.createElement('input', { type: 'hidden', name: 'yu', value: this.props.yu }),
      );
      this._userChangeForm = this.__self.inject(this, form, formContainer);
      this._userChangeForm.submit();
    },
    _registerItem: function _registerItem(uid, menuItem) {
      if (this.items[uid]) {
        return;
      }
      this.items[uid] = menuItem;
    },
    _unregisterItem: function _unregisterItem(uid) {
      if (this.items[uid]) {
        delete this.items[uid];
      }
    },
    _processLogout: function _processLogout(e, uid, menuItem) {
      this.props.processLogout && this.props.processLogout(e, uid, menuItem);
    },
    _renderMenuItems: function _renderMenuItems(items, options) {
      var _this = this;

      return items
        .map(function (item, index) {
          if (item.action === 'plus' && options.plus === undefined) {
            return '';
          }

          return '';
        })
        .filter(Boolean);
    },
    _getPassportHost: function _getPassportHost() {
      return this.props.passportHost || '';
    },
    _getRetpath: function _getRetpath() {
      var location = typeof window !== 'undefined' ? window.location : {};
      return this.props.retpath || location.href || '';
    },
    _onLogin: function _onLogin(e) {
      this.props.onLogin && this.props.onLogin(e);
    },
    _onLogout: function _onLogout(e) {
      this.props.onLogout && this.props.onLogout(e);
    },
    _onMenuItemClick: function _onMenuItemClick(e) {
      this.props.onMenuItemClick && this.props.onMenuItemClick(e);
    },
    _setReference: function _setReference(node) {
      this._DOMNode = node;
    },
    _setMaxHeight: function _setMaxHeight() {
      var maxHeight = this.props.menuMaxHeight;
      if (!maxHeight) {
        var docHeight = document.documentElement.clientHeight;
        var top = this._DOMNode.getBoundingClientRect().top;
        maxHeight = docHeight - top;
      }

      this.setState({ maxHeight: maxHeight });
    },
    userAccountReference: function userAccountReference(userAccount) {
      if (userAccount === undefined) {
        return this.userAccount;
      }
      return (this.userAccount = userAccount);
    },
    onSuccess: function onSuccess() {
      this._isBannerReady = true;
    },
  },
  {
    propTypes: {
      accountAttributes: PropTypes.object,
      provider: PropTypes.string,
      uid: PropTypes.string,
      yaplus: PropTypes.bool,
      unreadCount: PropTypes.number,
      contentRegion: PropTypes.string,
      passportHost: PropTypes.string,
      yu: PropTypes.string,
      hasAccentLetter: PropTypes.bool,
      retpath: PropTypes.string,
      actionsMenu: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            action: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          }),
        ]),
      ),
      multiAuthMenu: PropTypes.arrayOf(
        PropTypes.oneOfType([
          PropTypes.shape({
            action: PropTypes.string.isRequired,
          }),
          PropTypes.shape({
            url: PropTypes.string.isRequired,
            text: PropTypes.string.isRequired,
          }),
        ]),
      ),
      onCurrentAccountClick: PropTypes.func,
      menuMaxHeight: PropTypes.number,
      plusLinkParams: PropTypes.string,
      onLogin: PropTypes.func,
      onLogout: PropTypes.func,
      onMenuItemClick: PropTypes.func,
      passportLinkParams: PropTypes.string,
      name: PropTypes.string,
      maxLength: PropTypes.number,
      avatarId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
      avatarHost: PropTypes.string,
      settingsUrl: PropTypes.string,
      helpUrl: PropTypes.string,
      subname: PropTypes.string,
      fetchAccounts: PropTypes.bool,
      addAccountHidden: PropTypes.bool,
      pic: PropTypes.bool,
    },
    defaultProps: {
      accountAttributes: {},
      unreadCount: 0,
      hasAccentLetter: true,
      contentRegion: 'ru',
      menuMaxHeight: 0,
      actionsMenu: [{ action: 'mail' }, { action: 'plus' }],
      multiAuthMenu: [{ action: 'passport' }, { action: 'exit' }],
      passportLinkParams: '',
    },
    childContextTypes: {
      isPlusAvailable: PropTypes.bool,
      changeUser: PropTypes.func,
      registerUserItem: PropTypes.func,
      processLogout: PropTypes.func,
      menuItems: PropTypes.object,
    },
    Menu: Menu,
    Group: MenuGroup,
    inject: ReactDOM.unstable_renderSubtreeIntoContainer,
  },
);
