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

import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'icon',
    tag: 'span',
    mods: function mods(_ref) {
      var type = _ref.type,
        action = _ref.action,
        direction = _ref.direction,
        glyph = _ref.glyph,
        size = _ref.size,
        disabled = _ref.disabled;

      return {
        type: type,
        action: action,
        direction: direction,
        glyph: glyph,
        size: size,
        disabled: disabled,
      };
    },
    attrs: function attrs(_ref2) {
      var url = _ref2.url,
        id = _ref2.id,
        alt = _ref2.alt,
        _ref2$style = _ref2.style,
        style = _ref2$style === undefined ? {} : _ref2$style,
        _attrs = _ref2.attrs;

      if (url !== undefined) {
        style['backgroundImage'] = "url('" + url + "')";
      }

      return _extends(
        {
          id: id,
          alt: alt,
          style: style,
        },
        _attrs,
      );
    },
  },
  {
    propTypes: {
      id: PropTypes.string,
      url: PropTypes.string,
      style: PropTypes.object,
      direction: PropTypes.string,
      glyph: PropTypes.string,
      size: PropTypes.oneOf(['ns', 'xs', 's', 'm', 'n', 'l', 'head']),
    },
    isIcon: function isIcon(child) {
      return (
        child &&
        typeof child.type === 'function' &&
        (child.type.displayName === 'icon' ||
          child.type.displayName === 'Icon' ||
          // HACK for dist gemini
          // Because button2 checks for Icon.isIcon
          // https://github.com/bem/bem-react-core/issues/207
          child.type.displayName === 'x-icon')
      );
    },
  },
);
