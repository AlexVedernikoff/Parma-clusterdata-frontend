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
import { decl } from '@kamatech-lego/i-bem-react';
import '../control/control.react.js';
import _control from '../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _textarea__wrap from './__wrap/textarea__wrap.react.js';

var TextAreaWrap = _textarea__wrap.applyDecls();

// import "./__wrap/textarea__wrap.css";
import _textarea__control from './__control/textarea__control.react.js';

var TextAreaControl = _textarea__control.applyDecls();

// import "./__control/textarea__control.css";
import _textarea__box from './__box/textarea__box.react.js';

var TextAreaBox = _textarea__box.applyDecls();

// import "./__box/textarea__box.css";

export default decl(
  Control,
  {
    block: 'textarea',
    tag: 'span',
    willInit: function willInit() {
      /*%%%ISLDEBUG%%%*/ +0 &&
        console.assert(
          !this.props.autoFocus,
          'вместо autoFocus надо использовать focused',
        );

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
        iconLeft = _ref3.iconLeft,
        iconRight = _ref3.iconRight;

      return _extends({}, this.__base.apply(this, arguments), {
        theme: theme,
        size: size,
      });
    },
    content: function content(_ref4) {
      var id = _ref4.id,
        name = _ref4.name,
        text = _ref4.text,
        tabIndex = _ref4.tabIndex,
        cols = _ref4.cols,
        rows = _ref4.rows,
        placeholder = _ref4.placeholder,
        autocomplete = _ref4.autocomplete,
        controlAttrs = _ref4.controlAttrs;
      var disabled = this.state.disabled;

      return [
        React.createElement(
          TextAreaWrap,
          { key: 'wrap' },
          React.createElement(
            TextAreaControl,
            _extends(
              {
                id: id,
                name: name,
                cols: cols,
                rows: rows,
                tabIndex: tabIndex,
                disabled: disabled,
                placeholder: placeholder,
                value: text === undefined || text === null ? '' : text,
                innerRef: this.setControlReference,
                autoComplete: autocomplete === false ? 'off' : undefined,
                onChange: disabled ? undefined : this._onChange,
              },
              controlAttrs,
            ),
          ),
        ),
        React.createElement(TextAreaBox, { key: 'box' }),
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
      this._control.focus();
    },
    blur: function blur() {
      this._control.blur();
    },
  },
  {
    propTypes: {
      theme: PropTypes.string.isRequired,
      size: PropTypes.oneOf(['xs', 's', 'm']),
      id: PropTypes.string,
      name: PropTypes.string,
      tabIndex: PropTypes.string,
      text: PropTypes.string,
      placeholder: PropTypes.string,
      autocomplete: PropTypes.bool,
      onChange: PropTypes.func,
      cols: PropTypes.number,
      rows: PropTypes.number,
      innerRef: PropTypes.func,
    },
    defaultProps: {
      cols: 10,
      rows: 10,
      innerRef: function innerRef() {},
    },
  },
);
