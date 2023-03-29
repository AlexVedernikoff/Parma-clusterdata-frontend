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

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@parma-lego/i-bem-react';
import _icon from '../icon/icon.react.js';

var Icon = _icon.applyDecls();

// import "./../icon/icon.css";
import '../control/control.react.js';
import _control from '../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _link__inner from './__inner/link__inner.react.js';

var LinkInner = _link__inner.applyDecls();

// import "./__inner/link__inner.css";
import _link__icon from './__icon/link__icon.react.js';

var LinkIcon = _link__icon.applyDecls();

// import "./__icon/link__icon.css";

export default decl(
  Control,
  {
    block: 'link',
    tag: function tag(_ref) {
      var url = _ref.url;

      return url ? 'a' : 'span';
    },
    mods: function mods(_ref2) {
      var size = _ref2.size,
        theme = _ref2.theme,
        nonvisual = _ref2.nonvisual,
        inner = _ref2.inner;

      return _extends({}, this.__base.apply(this, arguments), {
        size: size,
        theme: theme,
        inner: bool2string(inner),
        nonvisual: bool2string(nonvisual),
      });
    },
    attrs: function attrs(_ref3) {
      var id = _ref3.id,
        name = _ref3.name,
        title = _ref3.title,
        target = _ref3.target,
        rel = _ref3.rel,
        tabIndex = _ref3.tabIndex,
        style = _ref3.style,
        url = _ref3.url,
        _attrs = _ref3.attrs;
      var disabled = this.state.disabled;

      if (target === '_blank') {
        if (rel && rel.indexOf('noopener') === -1) {
          rel = rel + ' noopener'; // Пользовательский атрибут имеет больший приоритет
        }
      }

      return _extends(
        {},
        this.__base.apply(this, arguments),
        {
          id: id,
          name: name,
          title: title,
          style: style,
          target: target,
          rel: rel,
          href: url,
          role: url ? undefined : 'button',
          tabIndex: disabled ? (url ? -1 : undefined) : tabIndex,
          'aria-disabled': disabled ? 'true' : undefined,
        },
        _attrs,
      );
    },
    content: function content(_ref4) {
      var text = _ref4.text,
        icon = _ref4.icon,
        iconLeft = _ref4.iconLeft,
        iconRight = _ref4.iconRight,
        children = _ref4.children;

      var content = [],
        innerElems = [],
        hasIconFromContent = this._hasIconFromContent(this.props),
        icons = [icon, iconLeft, iconRight].filter(Boolean),
        needSetSide = text || icons.length > 1; // Side не устанавливается, если иконка единственный элемент

      Children.forEach(children, function(child, i) {
        if (Icon.isIcon(child)) {
          var onlyIcon = Children.count(children) === 1;
          var side = onlyIcon ? '' : i === 0 ? 'left' : 'right';
          content.push(React.createElement(LinkIcon, { key: 'icon-' + i, side: side, children: child }));
        } else if (child) {
          // Undefined protection
          if (!innerElems.length) {
            content.push(
              hasIconFromContent ? React.createElement(LinkInner, { key: 'inner' }, innerElems) : innerElems,
            );
          }
          innerElems.push(child);
        }
      });
      if (content.length) {
        return content;
      }

      icon &&
        content.unshift(
          React.createElement(LinkIcon, {
            key: 'icon-default',
            side: needSetSide ? 'left' : '',
            children: Icon.isIcon(icon) ? icon : React.createElement(Icon, icon),
          }),
        );
      iconLeft &&
        content.unshift(
          React.createElement(LinkIcon, {
            key: 'icon-side-left',
            side: needSetSide ? 'left' : '',
            children: Icon.isIcon(iconLeft) ? iconLeft : React.createElement(Icon, iconLeft),
          }),
        );
      if (text) {
        if (!innerElems.length) {
          var hasIconFromFields = this._hasIconFromFields(this.props);
          content.push(hasIconFromFields ? React.createElement(LinkInner, { key: 'inner' }, innerElems) : innerElems);
        }
        innerElems.push(text);
      }
      iconRight &&
        content.push(
          React.createElement(LinkIcon, {
            key: 'icon-side-right',
            side: needSetSide ? 'right' : '',
            children: Icon.isIcon(iconRight) ? iconRight : React.createElement(Icon, iconRight),
          }),
        );
      return content;
    },
    _hasIconFromContent: function _hasIconFromContent(_ref5) {
      var children = _ref5.children;

      return Children.toArray(children).some(function(child) {
        return Icon.isIcon(child);
      });
    },
    _hasIconFromFields: function _hasIconFromFields(_ref6) {
      var icon = _ref6.icon,
        iconLeft = _ref6.iconLeft,
        iconRight = _ref6.iconRight;

      return icon || iconLeft || iconRight;
    },
  },
  {
    propTypes: {
      theme: PropTypes.string.isRequired,
      pseudo: PropTypes.bool,
      nonvisual: PropTypes.bool,
      id: PropTypes.string,
      url: PropTypes.string,
      target: PropTypes.string,
      title: PropTypes.string,
      name: PropTypes.string,
      tabIndex: PropTypes.string,
      text: PropTypes.string,
      icon: PropTypes.object,
      iconLeft: PropTypes.object,
      iconRight: PropTypes.object,
      onClick: PropTypes.func,
      rel: PropTypes.string,
    },
    defaultProps: {
      onClick: function onClick() {},

      tabIndex: '0',
    },
  },
);
