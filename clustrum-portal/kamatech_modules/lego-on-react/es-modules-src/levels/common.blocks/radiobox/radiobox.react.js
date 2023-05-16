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

import { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { decl } from '@kamatech-lego/i-bem-react';
import _radiobox__radio from './__radio/radiobox__radio.react.js';

var RadioBoxRadio = _radiobox__radio.applyDecls();

// import "./__radio/radiobox__radio.css";

export default decl(
  {
    block: 'radiobox',
    tag: 'span',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.onChange = this.onChange.bind(this);
    },
    attrs: function attrs(_ref) {
      var _attrs = _ref.attrs;

      return _extends({}, _attrs);
    },
    mods: function mods(_ref2) {
      var theme = _ref2.theme,
        size = _ref2.size,
        view = _ref2.view,
        tone = _ref2.tone;

      return { theme: theme, size: size, view: view, tone: tone };
    },
    content: function content(_ref3) {
      var _this = this;

      var mainDisabled = _ref3.disabled,
        mainValue = _ref3.value,
        name = _ref3.name,
        children = _ref3.children;

      return Children.map(children, function(item, key) {
        return typeof item.type === 'function'
          ? cloneElement(item, {
              name: name,
              key: key,
              mainValue: mainValue,
              mainDisabled: mainDisabled,
              onChange: mainDisabled ? undefined : _this.onChange,
            })
          : item;
      });
    },
    onChange: function onChange(e) {
      this.props.onChange && this.props.onChange(e);
    },
  },
  {
    Radio: RadioBoxRadio,
    propTypes: {
      theme: PropTypes.string,
      size: PropTypes.string,
      view: PropTypes.oneOf(['classic', 'default']),
      tone: PropTypes.string,
      disabled: PropTypes.bool,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    },
    defaultProps: {
      view: 'classic',
    },
  },
);
