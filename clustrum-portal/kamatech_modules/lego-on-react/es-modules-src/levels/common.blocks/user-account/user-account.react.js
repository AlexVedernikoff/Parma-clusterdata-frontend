var _extends =
  Object.assign ||
  function(target) {
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

import React from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import _userAccount__name from './__name/user-account__name.react.js';

var UserAccountName = _userAccount__name.applyDecls();

//import "./__name/user-account__name.css";
import _userAccount__pic from './__pic/user-account__pic.react.js';

var UserAccountPic = _userAccount__pic.applyDecls();

//import "./__pic/user-account__pic.css";
import _userAccount__subname from './__subname/user-account__subname.react.js';

var UserAccountSubname = _userAccount__subname.applyDecls();

//import "./__subname/user-account__subname.css";
import '../icon/icon.react.js';
import '../icon/_glyph/icon_glyph.react.js';
import _icon_glyph_xSign from '../icon/_glyph/icon_glyph_x-sign.react.js';

var Icon = _icon_glyph_xSign.applyDecls();

/*
import "./../icon/icon.css";
import "./../icon/_glyph/icon_glyph.css";
import "./../icon/_glyph/icon_glyph_x-sign.css";
import "./__logout/user-account__logout.css";
import "./../../desktop.blocks/user-account/__logout/user-account__logout.css";
 */

export default decl(
  {
    block: 'user-account',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.state = {};

      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onMouseOver = this.onMouseOver.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);

      this._changeUser = this._changeUser.bind(this);
    },
    tag: function tag(_ref) {
      var url = _ref.url;

      return url ? 'a' : 'div';
    },
    attrs: function attrs(_ref2) {
      var url = _ref2.url,
        onClick = _ref2.onClick;

      return {
        tabIndex: '0',
        href: url,
        // onClick прокидывается для текущего аккаунта из user2
        onClick: onClick || this._changeUser,
        onFocus: this.onFocus,
        onBlur: this.state.focused ? this.onBlur : undefined,
        onMouseOver: this.onMouseOver,
        onMouseLeave: this.state.hovered ? this.onMouseLeave : undefined,
      };
    },
    mods: function mods(_ref3) {
      var hasAccentLetter = _ref3.hasAccentLetter,
        subname = _ref3.subname,
        hasTicker = _ref3.hasTicker,
        hideName = _ref3.hideName,
        provider = _ref3.provider;

      return {
        provider: provider,
        'has-logout': bool2string(this.context.processLogout),
        'has-accent-letter': bool2string(hasAccentLetter),
        'has-subname': bool2string(subname),
        'has-ticker': bool2string(hasTicker),
        'hide-name': bool2string(hideName),
        focused: bool2string(this.state.focused),
        hovered: bool2string(this.state.hovered),
      };
    },
    content: function content(_ref4) {
      var name = _ref4.name,
        pic = _ref4.pic,
        avatarId = _ref4.avatarId,
        avatarHost = _ref4.avatarHost,
        hasAccentLetter = _ref4.hasAccentLetter,
        children = _ref4.children,
        subname = _ref4.subname,
        isCurrent = _ref4.isCurrent,
        provider = _ref4.provider,
        plus = _ref4.plus,
        maxLength = _ref4.maxLength;

      if (children) {
        return children;
      }

      name = name && this._cleverSubstring(name, maxLength);

      var content = [];
      if (pic) {
        if (pic.avatarId) {
          avatarId = pic.avatarId;
        }
        content.push(
          React.createElement(
            UserAccountPic,
            _extends(
              { key: 'pic' },
              {
                pic: pic,
                avatarId: avatarId,
                avatarHost: avatarHost,
                provider: provider,
                plus: plus,
              },
            ),
          ),
        );
      }

      if (name !== false) {
        if (subname && subname !== name) {
          content.push(
            React.createElement(
              UserAccountName,
              _extends({ key: 'name' }, { hasAccentLetter: hasAccentLetter }),
              name,
              React.createElement(UserAccountSubname, { subname: subname }),
            ),
          );
        } else {
          content.push(
            React.createElement(
              UserAccountName,
              _extends({ key: 'name' }, { hasAccentLetter: hasAccentLetter, text: name }),
            ),
          );
        }
      }

      if (this.context.processLogout && !isCurrent) {
        return content.concat(
          React.createElement(Icon, {
            key: 'logout',
            glyph: 'x-sign',
            size: 'xs',
            mix: { block: this.block, elem: 'logout' },
            attrs: { onClick: this._processLogout.bind(this) },
          }),
        );
      }
      return content;
    },
    onFocus: function onFocus() {
      this.setState({ focused: true });
    },
    onBlur: function onBlur() {
      this.setState({ focused: false });
    },
    onMouseOver: function onMouseOver(e) {
      this.setState({ hovered: true });
      this.props.onMouseOver && this.props.onMouseOver(e);
    },
    onMouseLeave: function onMouseLeave() {
      this.setState({ hovered: false });
    },
    _changeUser: function _changeUser(e) {
      if (this.isLogoutClick) {
        this.isLogoutClick = false;
        return;
      }

      !this.props.isCurrent &&
        !this.props.isAddAccount &&
        this.context.changeUser &&
        this.context.changeUser(e, this.props.uid);
    },
    _processLogout: function _processLogout(e) {
      this.isLogoutClick = true;

      var menuItems = this.context.menuItems || {};
      this.context.processLogout(e, this.props.uid, menuItems[this.props.uid]);
    },
    _cleverSubstring: function _cleverSubstring(str, maxLength) {
      return str.length > maxLength ? str.substring(0, maxLength - 1) + '…' : str;
    },
  },
  {
    propTypes: {
      uid: PropTypes.string,
      url: PropTypes.string,
      isCurrent: PropTypes.bool,
      isAddAccount: PropTypes.bool,
      avatarHost: PropTypes.string,
      pic: PropTypes.bool,
      hasAccentLetter: PropTypes.bool,
      tickerMaxCount: PropTypes.number,
      tickerCount: PropTypes.number,
      hideName: PropTypes.string,
      hasTicker: PropTypes.string,
      onMouseOver: PropTypes.func,
      maxLength: PropTypes.number,
    },
    defaultProps: {
      maxLength: 16,
    },
    contextTypes: {
      changeUser: PropTypes.func,
      processLogout: PropTypes.func,
      menuItems: PropTypes.object,
    },
  },
);
