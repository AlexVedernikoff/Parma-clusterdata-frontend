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
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';
import _radiobox__radio from '../../radiobox/__radio/radiobox__radio.react.js';

var RadioBoxRadio = _radiobox__radio.applyDecls();

// import "./../../radiobox/__radio/radiobox__radio.css";
import _radioButton__control from '../__control/radio-button__control.react.js';

var RadioControl = _radioButton__control.applyDecls();

/*
import "./../__control/radio-button__control.css";
import "./../../../desktop.blocks/radio-button/__control/radio-button__control.css";
import "./../__text/radio-button__text.css";
*/

export default decl(
  RadioBoxRadio,
  {
    block: 'radio-button',
    elem: 'radio',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.setReference = this.setReference.bind(this);
      this.onClick = this.onClick.bind(this);
    },
    attrs: function attrs(_ref) {
      var style = _ref.style;

      return _extends({}, this.__base.apply(this, arguments), {
        style: style,
      });
    },
    mods: function mods(_ref2) {
      var side = _ref2.side,
        onlyIcon = _ref2.onlyIcon;

      return _extends({}, this.__base.apply(this, arguments), {
        'only-icon': bool2string(onlyIcon),
        side: side,
      });
    },
    content: function content(_ref3) {
      var children = _ref3.children,
        value = _ref3.value,
        mainValue = _ref3.mainValue,
        onlyIcon = _ref3.onlyIcon,
        disabled = _ref3.disabled,
        _ref3$id = _ref3.id,
        id = _ref3$id === undefined ? this.generateId() : _ref3$id,
        name = _ref3.name,
        onChange = _ref3.onChange,
        tabIndex = _ref3.tabIndex;

      var content = [
        React.createElement(
          RadioControl,
          _extends(
            { key: 'control' },
            {
              id: id,
              name: name,
              value: value,
              onChange: onChange,
              disabled: disabled,
              innerRef: this.setReference,
              onClick: disabled ? undefined : this.onClick,
              checked: this._isChecked(value, mainValue),
              tabIndex: tabIndex,
            },
          ),
        ),
      ];

      if (onlyIcon) {
        return content.concat('\xA0', children);
      }

      return content.concat(
        React.createElement(
          Bem,
          {
            key: 'text',
            block: this.block,
            elem: 'text',
            tag: 'span',
          },
          children,
        ),
      );
    },
    setReference: function setReference(control) {
      this.control = control;
    },
    onClick: function onClick(event) {
      this.control.focus();
      this.props.onClick && this.props.onClick(event);
    },
  },
  {
    isRadio: function isRadio(child) {
      return child.type && child.type.displayName === 'radio-button__radio';
    },
  },
);
