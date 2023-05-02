function _extends() {
  _extends =
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
  return _extends.apply(this, arguments);
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(
        Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }),
      );
    }
    ownKeys.forEach(function(key) {
      _defineProperty(target, key, source[key]);
    });
  }
  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { decl, bool2string } from '@kamatech-lego/i-bem-react';
import ReactDOM from 'react-dom';
import _keycodes from '../keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

import '../control/control.react.js';
import _control from '../../desktop.blocks/control/control.react.js';

var Control = _control.applyDecls();

import _tumbler__box from './__box/tumbler__box.react.js';

var TumblerBox = _tumbler__box.applyDecls();

// import "./__box/tumbler__box.css";
import _tumbler__input from './__input/tumbler__input.react.js';

var TumblerInput = _tumbler__input.applyDecls();

// import "./__input/tumbler__input.css";
import _tumbler__option from './__option/tumbler__option.react.js';

var TumblerOption = _tumbler__option.applyDecls();

var checkKeys = [Keys.LEFT, Keys.RIGHT, Keys.UP, Keys.DOWN];
export default decl(
  Control,
  {
    block: 'tumbler',
    tag: 'span',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this.onChange = this.onChange.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this._getLabel = this._getLabel.bind(this);
      this._defineLabelAction = this._defineLabelAction.bind(this);
    },
    attrs: function attrs(_ref) {
      var disabled = _ref.disabled,
        _attrs = _ref.attrs,
        title = _ref.title;
      return _objectSpread({}, this.__base.apply(this, arguments), _attrs, {
        title: title,
        onMouseMove: disabled ? undefined : this.onMouseMove,
      });
    },
    _getControlAttrs: function _getControlAttrs() {
      return {};
    },
    mods: function mods(_ref2) {
      var view = _ref2.view,
        theme = _ref2.theme,
        size = _ref2.size,
        checked = _ref2.checked;
      return _objectSpread({}, this.__base.apply(this, arguments), {
        view: view,
        theme: theme,
        size: size,
        checked: bool2string(checked),
      });
    },
    getChildContext: function getChildContext() {
      return {
        getLabel: this._getLabel,
        defineLabelAction: this._defineLabelAction,
      };
    },
    content: function content(_ref3) {
      var _this = this;

      var _ref3$id = _ref3.id,
        id = _ref3$id === void 0 ? this.generateId() : _ref3$id,
        view = _ref3.view,
        name = _ref3.name,
        checked = _ref3.checked,
        disabled = _ref3.disabled,
        tabIndex = _ref3.tabIndex,
        controlAttrs = _ref3.controlAttrs,
        onVal = _ref3.onVal,
        offVal = _ref3.offVal,
        children = _ref3.children;
      var onChange = disabled ? undefined : this.onChange;

      var _this$_setLabels = this._setLabels(children),
        leftLabel = _this$_setLabels.leftLabel,
        rightLabel = _this$_setLabels.rightLabel;

      return [
        leftLabel &&
          React.createElement(TumblerOption, {
            key: 'leftLabel',
            side: 'left',
            checked: checked,
            onChange: onChange,
            id: 'left' + id,
            text: leftLabel.props.text || leftLabel.props.children,
          }),
        React.createElement(
          TumblerBox,
          _extends(
            {
              key: 'box',
            },
            {
              view: view,
              id: id,
              onChange: onChange,
              ref: function ref(box) {
                return (_this._box = ReactDOM.findDOMNode(box));
              },
              checked: checked,
              disabled: disabled,
              tabIndex: tabIndex,
              buttonRef: function buttonRef(button) {
                return (_this._button = ReactDOM.findDOMNode(button));
              },
            },
          ),
        ),
        React.createElement(
          TumblerInput,
          _extends(
            {
              key: 'input',
            },
            {
              id: id,
              name: name,
              onVal: onVal,
              offVal: offVal,
              checked: checked,
              disabled: disabled,
              onChange: onChange,
              attrs: controlAttrs,
            },
          ),
        ),
        rightLabel &&
          React.createElement(TumblerOption, {
            key: 'rightLabel',
            side: 'right',
            checked: checked,
            onChange: onChange,
            id: 'right' + id,
            text: rightLabel.props.text || rightLabel.props.children,
          }),
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
    onKeyUp: function onKeyUp(e) {
      if (e.which === Keys.SPACE) {
        this.setState({
          pressed: false,
        });
      }

      this.__base.apply(this, arguments);
    },
    onKeyDown: function onKeyDown(e) {
      if (e.which === Keys.SPACE) {
        this.setState({
          pressed: true,
        });
      } // Предотвращаем прокрутку страницы.

      checkKeys.indexOf(e.which) !== -1 && e.preventDefault();

      if (this.props.checked) {
        Keys.is(e.which, 'LEFT', 'DOWN') && this.onChange(e);
      } else {
        Keys.is(e.which, 'RIGHT', 'UP') && this.onChange(e);
      }

      this.__base.apply(this, arguments);
    },
    onMouseMove: function onMouseMove(e) {
      if (this.props.view === 'classic') {
        if (e.target !== this._button && this._box.contains(e.target)) {
          this.setState({
            hovered: true,
          });
        } else {
          this.setState({
            hovered: false,
          });
        }
      } else {
        this.setState({
          hovered: true,
        });
      }
    },
    _setLabels: function _setLabels(labels) {
      if (Children.count(labels) === 2) {
        return {
          leftLabel: labels[0],
          rightLabel: labels[1],
        };
      } else if (Children.count(labels)) {
        var side = labels.props.side;
        return side === 'left' || !side
          ? {
              leftLabel: labels,
            }
          : {
              rightLabel: labels,
            };
      }

      return {};
    },
    _getLabel: function _getLabel(id) {
      var _this$props = this.props,
        checked = _this$props.checked,
        labels = _this$props.children;

      if (Children.count(labels) === 2) {
        return checked ? 'left'.concat(id) : 'right'.concat(id);
      } else if (Children.count(labels)) {
        var side = labels.props.side;
        return side === 'left' || !side ? 'left'.concat(id) : 'right'.concat(id);
      }
    },
    _defineLabelAction: function _defineLabelAction(side, action) {
      var _this$props2 = this.props,
        checked = _this$props2.checked,
        labels = _this$props2.children;

      if (Children.count(labels) === 2) {
        action = (checked && side !== 'left') || (!checked && side !== 'right') ? undefined : action;
      }

      return action;
    },
  },
  {
    Option: TumblerOption,
    On: TumblerOption,
    Off: TumblerOption,
    propTypes: {
      view: PropTypes.string,
      tone: PropTypes.oneOf(['default', 'red', 'grey', 'dark']),
      size: PropTypes.oneOf(['xs', 's', 'm', 'n']),
      theme: PropTypes.oneOf(['normal', 'tiny']),
      children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
    },
    defaultProps: {
      view: 'classic',
    },
    childContextTypes: {
      getLabel: PropTypes.func,
      defineLabelAction: PropTypes.func,
    },
  },
);
