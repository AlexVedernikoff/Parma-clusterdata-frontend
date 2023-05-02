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
import { decl, bool2string } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'control',
    willInit: function willInit(_ref) {
      var disabled = _ref.disabled,
        focused = _ref.focused,
        pressed = _ref.pressed;

      this.state = {
        disabled: disabled,
        focused: focused,
        pressed: pressed,
      };

      this.onFocus = this.onFocus.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onMouseDown = this.onMouseDown.bind(this);
      this.onMouseUp = this.onMouseUp.bind(this);

      this.onClick = this.onClick.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.onKeyDown = this.onKeyDown.bind(this);

      this.docOnMouseUp = this.docOnMouseUp.bind(this);
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var disabled = _ref2.disabled;

      if (disabled !== this.props.disabled) {
        this.setState({ disabled: disabled });
      }
      if (disabled) {
        this.setState({ focused: false, pressed: false });
      }
    },
    mods: function mods() {
      var _state = this.state,
        pressed = _state.pressed,
        disabled = _state.disabled,
        focused = _state.focused;

      return {
        disabled: bool2string(disabled),
        focused: disabled ? undefined : bool2string(focused),
        pressed: disabled ? undefined : bool2string(pressed),
      };
    },
    attrs: function attrs() {
      var disabled = this.state.disabled;

      return _extends(
        {
          onFocus: disabled ? undefined : this.onFocus,
          onBlur: disabled ? undefined : this.onBlur,
          onMouseDown: disabled ? undefined : this.onMouseDown,
          onMouseUp: disabled ? undefined : this.onMouseUp,
          onKeyUp: disabled ? undefined : this.onKeyUp,
          onKeyDown: disabled ? undefined : this.onKeyDown,
          onClick: disabled ? undefined : this.onClick,
        },
        this._getControlAttrs.apply(this, arguments),
      );
    },
    _getControlAttrs: function _getControlAttrs(_ref3) {
      var controlAttrs = _ref3.controlAttrs;

      return controlAttrs;
    },
    onMouseDown: function onMouseDown(e) {
      // по нажатию правой кнопки мыши
      // не нужно выставлять pressed
      if (e.nativeEvent.which === 3) {
        return;
      }
      this.setState({ pressed: true });
      this.props.onMouseDown && this.props.onMouseDown(e);
      this.docOnMouseDown();
    },
    onMouseUp: function onMouseUp(e) {
      this.setState({ pressed: false });
      this.props.onMouseUp && this.props.onMouseUp(e);
    },
    onClick: function onClick(e) {
      this.props.onClick && this.props.onClick(e);
    },
    onKeyDown: function onKeyDown(e) {
      this.props.onKeyDown && this.props.onKeyDown(e);
    },
    onKeyUp: function onKeyUp(e) {
      this.props.onKeyUp && this.props.onKeyUp(e);
    },
    onFocus: function onFocus(e) {
      this.setState({ focused: true });
      this.props.onFocus && this.props.onFocus(e);
    },
    onBlur: function onBlur(e) {
      this.setState({ focused: false });
      this.props.onBlur && this.props.onBlur(e);
    },
    docOnMouseDown: function docOnMouseDown() {
      // необходимо слушать mouseup вне блока, иначе
      // при отпущенной вовне кнопке мыши блок остается pressed
      document.addEventListener('mouseup', this.docOnMouseUp);
      // необходимо для button2_type_link
      document.addEventListener('dragend', this.docOnMouseUp);
    },
    docOnMouseUp: function docOnMouseUp() {
      this.setState({ pressed: false });
      document.removeEventListener('mouseup', this.docOnMouseUp);
      document.removeEventListener('dragend', this.docOnMouseUp);
    },
  },
  {
    propTypes: {
      disabled: PropTypes.bool,
      focused: PropTypes.bool,
      pressed: PropTypes.bool,
      onFocus: PropTypes.func,
      onBlur: PropTypes.func,
      onMouseDown: PropTypes.func,
      onMouseUp: PropTypes.func,
      controlAttrs: PropTypes.object,
    },
  },
);
