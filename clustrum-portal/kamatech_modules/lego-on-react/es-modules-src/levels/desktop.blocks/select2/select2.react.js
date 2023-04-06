var _extends =
  Object.assign ||
  function (target) {
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
import _keycodes from '../../common.blocks/keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

export default decl(
  {
    block: 'select2',
    tag: 'span',
    willInit: function willInit(_ref) {
      var val = _ref.val;

      this.__base.apply(this, arguments);

      this._onButtonKeyDown = this._onButtonKeyDown.bind(this);
      this._onButtonKeyUp = this._onButtonKeyUp.bind(this);
      this._onButtonKeyPress = this._onButtonKeyPress.bind(this);
    },
    willUpdate: function willUpdate(nextProps, nextState) {
      if (nextState.opened) {
        this._preventToToggleOpened = false;
        this._keysToMenu = false;
      }
      // В случае, когда селект открылся и меню уже инициализировано,
      // нужно подсветить соответствующий item. Но для этого меню должно правильно посчитать
      // собственные размеры, поэтому через контекст пробрасывается флаг о том, что селект открылся.
      if (!nextState.opened || this.state.opened) {
        this._wasOpened = false;
        return;
      }

      this._wasOpened = true;
    },
    getChildContext: function getChildContext() {
      return _extends({}, this.__base(), {
        wasOpened: this._wasOpened,
        isIE: Boolean(typeof document !== 'undefined' && document.documentMode),
      });
    },
    _onButtonKeyDown: function _onButtonKeyDown(e) {
      var keycode = e.keyCode;

      if (this.state.opened) {
        this._menu && this._menu.onKeyDown(e);
        this._keysToMenu = true;
        this._preventToToggleOpened = true;
      } else if (Keys.is(keycode, 'UP', 'DOWN')) {
        e.preventDefault();
        this._keysToMenu = false;
        this._preventToToggleOpened = false;
        this.setState({ opened: true });
      } else {
        this._preventToToggleOpened = false;
      }
    },
    _onButtonKeyUp: function _onButtonKeyUp(e) {
      if (this.state.opened && this._keysToMenu) {
        this._menu && this._menu.onKeyUp(e);
        this._keysToMenu = false;
      }
    },
    _onButtonClick: function _onButtonClick() {
      if (this._preventToToggleOpened || this._preventToToggleOpenedForce) {
        this._preventToToggleOpened = false;
        this._preventToToggleOpenedForce = false;
      } else {
        this.__base.apply(this, arguments);
      }
    },
    _onButtonBlur: function _onButtonBlur() {
      this._preventToToggleOpened = false;
      this._preventToToggleOpenedForce = false;
      this.__base.apply(this, arguments);
    },
    _onButtonKeyPress: function _onButtonKeyPress(e) {
      // В keyCode приходит 0
      var charCode = e.charCode;

      if (!Keys.is(charCode, 'UP', 'DOWN', 'ENTER', 'SPACE')) {
        this._menu.onKeyPress(e);

        if (this.state.opened) {
          return;
        }

        if (this._menu._hoveredItem) {
          var val = this._menu._hoveredItem.props.val;
          this.setState({ val: this._prepareVal(val) });
        }
      } else {
        this._menu.onKeyPress(e);
      }
    },
    _getButtonProps: function _getButtonProps() {
      return _extends({}, this.__base.apply(this, arguments), {
        onKeyDown: this._onButtonKeyDown,
        onKeyUp: this._onButtonKeyUp,
        onKeyPress: this._onButtonKeyPress,
      });
    },
  },
  {
    childContextTypes: {
      getMenu: PropTypes.func,
      wasOpened: PropTypes.bool,
      isIE: PropTypes.bool,
    },
  },
);
