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
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _keycodes from '../keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import '../control/control.react.js';
import _control from '../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _checkbox__box from './__box/checkbox__box.react.js';

var CheckBoxBox = _checkbox__box.applyDecls();

//import "./__box/checkbox__box.css";
//import "./../../desktop.blocks/checkbox/__box/checkbox__box.css";
import _checkbox__control from './__control/checkbox__control.react.js';

var CheckBoxControl = _checkbox__control.applyDecls();

//import "./__control/checkbox__control.css";
//import "./../../desktop.blocks/checkbox/__control/checkbox__control.css";
import _checkbox__tick from './__tick/checkbox__tick.react.js';

var CheckBoxTick = _checkbox__tick.applyDecls();

//import "./__tick/checkbox__tick.css";
//import "./../../desktop.blocks/checkbox/__tick/checkbox__tick.css";
import _checkbox__label from './__label/checkbox__label.react.js';

var CheckBoxLabel = _checkbox__label.applyDecls();

//import "./__label/checkbox__label.css";
//import "./../../desktop.blocks/checkbox/__label/checkbox__label.css";

// Импорт модификатора, выставляющегося по умолчанию.

//import "./checkbox.css";
//import "./../../desktop.blocks/checkbox/checkbox.css";
//import "./_lines/checkbox_lines_multi.css";

export default decl(
  Control,
  {
    block: 'checkbox',
    tag: 'span',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.onChange = this.onChange.bind(this);
    },
    didMount: function didMount() {
      this.DOMNode = ReactDOM.findDOMNode(this);
      this.inputElement = ReactDOM.findDOMNode(this.inputRef);
    },
    attrs: function attrs(_ref) {
      var title = _ref.title,
        _attrs = _ref.attrs;

      return _extends({}, this.__base.apply(this, arguments), _attrs, {
        title: title,
      });
    },
    _getControlAttrs: function _getControlAttrs() {
      return {};
    },
    mods: function mods(_ref2) {
      var view = _ref2.view,
        theme = _ref2.theme,
        size = _ref2.size,
        checked = _ref2.checked,
        lines = _ref2.lines;

      // TODO: Вернуть assert при отведении мажорной ветки 6.0,
      // console.assert(lines !== undefined,
      // 'В 6.0 _lines_multi не будет выставляться по умолчанию');
      if (lines === undefined) {
        lines = 'multi';
      }

      return _extends({}, this.__base.apply(this, arguments), {
        view: view,
        theme: theme,
        size: size,
        lines: lines,
        checked: bool2string(checked),
      });
    },
    content: function content(_ref3) {
      var _this = this;

      var children = _ref3.children,
        text = _ref3.text,
        _ref3$id = _ref3.id,
        id = _ref3$id === undefined ? this.generateId() : _ref3$id,
        name = _ref3.name,
        view = _ref3.view,
        size = _ref3.size,
        value = _ref3.value,
        checked = _ref3.checked,
        controlAttrs = _ref3.controlAttrs,
        disabled = _ref3.disabled,
        tabIndex = _ref3.tabIndex;

      var labeledBy = 'label' + id;
      var label = children || text;

      return [
        React.createElement(
          CheckBoxBox,
          { key: 'box' },
          React.createElement(
            CheckBoxControl,
            _extends(
              {
                id: id,
                name: name,
                value: value,
                checked: checked,
                disabled: disabled,
                labeledBy: labeledBy,
                tabIndex: tabIndex,
                onChange: disabled ? undefined : this.onChange,
                onKeyDown: disabled ? undefined : this.onKeyDown,
                onKeyUp: disabled ? undefined : this.onKeyUp,
                attrs: controlAttrs,
              },
              {
                ref: function ref(input) {
                  return (_this.inputRef = input);
                },
              },
            ),
          ),
          React.createElement(CheckBoxTick, { view: view, size: size }),
        ),
        label &&
          React.createElement(
            CheckBoxLabel,
            {
              key: 'label',
              id: labeledBy,
              htmlFor: id,
            },
            label,
          ),
      ];
    },
    onChange: function onChange(e) {
      this.props.onChange && this.props.onChange(e);
    },
    onClick: function onClick(e) {
      if (e.target === this.DOMNode) {
        this.inputElement.click();
      }
    },
    onKeyDown: function onKeyDown(e) {
      if (e.which === Keys.SPACE) {
        this.setState({ pressed: true });
      }
      this.__base.apply(this, arguments);
    },
    onKeyUp: function onKeyUp(e) {
      if (e.which === Keys.SPACE) {
        this.setState({ pressed: false });
      }
      this.__base.apply(this, arguments);
    },
  },
  {
    propTypes: {
      view: PropTypes.oneOf(['classic', 'default']),
      tone: PropTypes.string,
      theme: PropTypes.string,
      size: PropTypes.oneOf(['s', 'm', 'n']),
      name: PropTypes.string,
      title: PropTypes.string,
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.element]),
      lines: PropTypes.oneOf([false, 'one', 'multi']),
      onChange: PropTypes.func,
      onKeyUp: PropTypes.func,
      onKeyDown: PropTypes.func,
    },
    defaultProps: {
      view: 'classic',
      onChange: function onChange() {},
    },
  },
);
