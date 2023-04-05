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
import { decl, bool2string } from '@parma-lego/i-bem-react';
import '../../control/control.react.js';
import _control from '../../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _radiobox__box from '../__box/radiobox__box.react.js';

var RadioBoxBox = _radiobox__box.applyDecls();

// import "./../__box/radiobox__box.css";
import _radiobox__control from '../__control/radiobox__control.react.js';

var RadioBoxControl = _radiobox__control.applyDecls();

// import "./../__control/radiobox__control.css";
import _radiobox__text from '../__text/radiobox__text.react.js';

var RadioBoxText = _radiobox__text.applyDecls();

export default decl(
  Control,
  {
    block: 'radiobox',
    elem: 'radio',
    tag: 'label',
    attrs: function attrs(_ref) {
      var _ref$id = _ref.id,
        htmlFor = _ref$id === undefined ? this.generateId() : _ref$id;

      return _extends({}, this.__base.apply(this, arguments), {
        htmlFor: htmlFor,
      });
    },
    mods: function mods(_ref2) {
      var disabled = _ref2.disabled,
        mainDisabled = _ref2.mainDisabled,
        value = _ref2.value,
        mainValue = _ref2.mainValue,
        checked = _ref2.checked;

      return _extends({}, this.__base.apply(this, arguments), {
        disabled: bool2string(disabled || mainDisabled),
        checked: bool2string(this._isChecked(value, mainValue, checked)),
      });
    },
    content: function content(_ref3) {
      var _ref3$id = _ref3.id,
        id = _ref3$id === undefined ? this.generateId() : _ref3$id,
        name = _ref3.name,
        mainDisabled = _ref3.mainDisabled,
        disabled = _ref3.disabled,
        value = _ref3.value,
        checked = _ref3.checked,
        mainValue = _ref3.mainValue,
        children = _ref3.children,
        tabIndex = _ref3.tabIndex;

      return [
        React.createElement(
          RadioBoxBox,
          { key: 'box' },
          React.createElement(RadioBoxControl, {
            name: name,
            id: id,
            value: value,
            checked: this._isChecked(value, mainValue, checked),
            onChange: this.props.onChange,
            disabled: disabled || mainDisabled,
            tabIndex: tabIndex,
          }),
        ),
        React.createElement(RadioBoxText, { key: 'text' }, children),
      ];
    },
    _isChecked: function _isChecked(value, mainValue, checked) {
      return checked || (value !== undefined && value === mainValue);
    },
  },
  {
    propTypes: {
      disabled: PropTypes.bool,
      name: PropTypes.string,
      id: PropTypes.string,
      mainDisabled: PropTypes.bool,
      checked: PropTypes.bool,
      mainValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      tabIndex: PropTypes.number,
    },
  },
);
