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
import '../control/control.react.js';
import _control from '../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _textinput__control from './__control/textinput__control.react.js';

var TextInputControl = _textinput__control.applyDecls();

// import "./__control/textinput__control.css";
import _textinput__box from './__box/textinput__box.react.js';

var TextInputBox = _textinput__box.applyDecls();

// import "./__box/textinput__box.css";

export default decl(
  Control,
  {
    block: 'textinput',
    tag: 'span',
    willInit: function willInit() {
      /*%%%ISLDEBUG%%%*/ +0 && console.assert(!this.props.autoFocus, 'вместо autoFocus надо использовать focused');

      this.__base.apply(this, arguments);

      this._onChange = this._onChange.bind(this);
      this.setControlReference = this.setControlReference.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref) {
      var focused = _ref.focused;

      this.__base.apply(this, arguments);
      if (focused !== this.props.focused) {
        this.setState({ focused: focused });

        this[focused ? 'focus' : 'blur']();
      }
    },
    attrs: function attrs(_ref2) {
      var style = _ref2.style,
        _attrs = _ref2.attrs;

      return _extends({}, this.__base.apply(this, arguments), _attrs, {
        style: style,
      });
    },
    _getControlAttrs: function _getControlAttrs() {
      return {};
    },
    mods: function mods(_ref3) {
      var type = _ref3.type,
        theme = _ref3.theme,
        size = _ref3.size,
        pin = _ref3.pin,
        view = _ref3.view,
        baseline = _ref3.baseline;

      return _extends({}, this.__base.apply(this, arguments), {
        baseline: bool2string(baseline),
        type: type !== 'text' && type,
        theme: theme,
        view: view,
        size: size,
        pin: pin,
      });
    },
    content: function content(_ref4) {
      var id = _ref4.id,
        type = _ref4.type,
        name = _ref4.name,
        text = _ref4.text,
        tabIndex = _ref4.tabIndex,
        placeholder = _ref4.placeholder,
        autocomplete = _ref4.autocomplete,
        controlAttrs = _ref4.controlAttrs,
        onKeyDown = _ref4.onKeyDown;
      var disabled = this.state.disabled;

      return [
        React.createElement(
          TextInputControl,
          _extends(
            { key: 'control' },
            _extends(
              {
                id: id,
                type: type,
                name: name,
                tabIndex: tabIndex,
                disabled: disabled,
                placeholder: placeholder,
                value: text === undefined ? '' : text,
                innerRef: this.setControlReference,
                autoComplete: autocomplete === false ? 'off' : undefined,
                onChange: disabled ? undefined : this._onChange,
                onKeyDown: disabled ? undefined : onKeyDown,
              },
              controlAttrs,
            ),
          ),
        ),
        React.createElement(TextInputBox, { key: 'box' }),
      ];
    },
    _onChange: function _onChange(e) {
      this.props.onChange && this.props.onChange(e.target.value, this.props);
    },
    setControlReference: function setControlReference(control) {
      this._control = control;
      this.props.innerRef(control);
    },
    focus: function focus() {
      this._control && this._control.focus();
    },
    blur: function blur() {
      this._control && this._control.blur();
    },
  },
  {
    propTypes: {
      baseline: PropTypes.bool,
      view: PropTypes.oneOf(['classic', 'default']),
      tone: PropTypes.string,
      theme: PropTypes.string.isRequired,
      size: PropTypes.oneOf(['xs', 's', 'm', 'n']),
      type: PropTypes.string,
      id: PropTypes.string,
      name: PropTypes.string,
      tabindex: PropTypes.string,
      text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      placeholder: PropTypes.string,
      autocomplete: PropTypes.bool,
      onChange: PropTypes.func,
      innerRef: PropTypes.func,
    },
    defaultProps: {
      view: 'classic',
      type: 'text',
      onChange: function onChange() {},
      innerRef: function innerRef() {},
    },
  },
);
