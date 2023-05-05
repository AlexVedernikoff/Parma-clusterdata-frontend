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
import React, { Children } from 'react';
import ReactDOM from 'react-dom';
import Bem, { declMod, bool2string } from '@kamatech-lego/i-bem-react';
import throttle from 'lodash.throttle';
import _radioButton__radio from '../__radio/radio-button__radio.react.js';

var RadioButtonRadio = _radioButton__radio.applyDecls();

//import "./../__radio/radio-button__radio.css";
//import "./../../../desktop.blocks/radio-button/__radio/radio-button__radio.css";

var PLATE_MARGIN = 3;

export default declMod(
  { view: 'default' },
  {
    block: 'radio-button',
    willInit: function willInit() {
      this.__base.apply(this, arguments);
      this.state = {
        plateLeft: PLATE_MARGIN,
        plateWidth: 0,
      };
      this.onWinResize = throttle(this.onWinResize.bind(this), 300);
    },
    didMount: function didMount() {
      this.__base.apply(this, arguments);
      this._setPlate({ isAnimatedOn: false });

      window.addEventListener('resize', this.onWinResize);
    },
    willUnmount: function willUnmount() {
      this.__base();

      window.removeEventListener('resize', this.onWinResize);
    },
    didUpdate: function didUpdate() {
      this.__base.apply(this, arguments);
      // Необходимо включить анимацию после инициализации
      this._setPlate({ isAnimatedOn: true });
    },

    /**
     * Обработчик при изменении размеров окна.
     *
     * @private
     */
    onWinResize: function onWinResize() {
      var _this = this;

      this._setPlate({ isAnimatedOn: false });
      setTimeout(function() {
        return _this.setState({ isAnimatedOn: true });
      }, 0);
    },
    mods: function mods(_ref) {
      var tone = _ref.tone;

      return _extends({}, this.__base.apply(this, arguments), {
        tone: tone,
        animated: bool2string(this.state.isAnimatedOn),
      });
    },
    content: function content(_ref2) {
      var _this2 = this;

      var mainValue = _ref2.value,
        freeWidth = _ref2.freeWidth;

      var children = this.__base.apply(this, arguments);
      var radios = 0;
      var width = 100;

      Children.forEach(children, function(child) {
        if (RadioButtonRadio.isRadio(child)) {
          radios++;
        }
      });

      width = (100 / (radios || 1)).toFixed(4);
      children = Children.map(children, function(child) {
        if (!RadioButtonRadio.isRadio(child)) {
          return;
        }

        var style = _extends({}, child.props.style);
        if (!freeWidth) {
          /* DEPRECATED 6.0 Флаг станет по умолчанию */
          style.width = width + '%';
        }

        var value = child.props.value || child.props.controlAttrs.value;
        var needRef = value !== undefined && value === mainValue;
        var ref = function ref(radio) {
          return (_this2._checked = radio);
        };

        return React.cloneElement(child, needRef ? { style: style, ref: ref } : { style: style });
      });

      var style = {
        left: this.state.plateLeft,
        width: this.state.plateWidth,
      };

      return [
        React.createElement(Bem, { key: 'plate', block: 'radio-button', elem: 'plate', attrs: { style: style } }),
        children,
      ];
    },
    _setPlate: function _setPlate() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        isAnimatedOn = _ref3.isAnimatedOn;

      var checkedNode = ReactDOM.findDOMNode(this._checked);
      var plateLeft = checkedNode.offsetLeft + PLATE_MARGIN;
      var plateWidth = checkedNode.offsetWidth - PLATE_MARGIN * 2;

      if (this.state.plateLeft !== plateLeft || this.state.plateWidth !== plateWidth) {
        this.setState({
          plateLeft: plateLeft,
          plateWidth: plateWidth,
          isAnimatedOn: isAnimatedOn,
        });
      }
    },
  },
  {
    propTypes: {
      tone: PropTypes.oneOf(['default', 'red', 'grey', 'dark']),
      freeWidth: PropTypes.bool,
    },
    defaultProps: {
      tone: 'default',
    },
  },
);
