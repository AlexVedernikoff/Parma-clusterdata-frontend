import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { declMod } from '@kamatech-lego/i-bem-react';
import _keycodes from '../../keycodes/keycodes.react.js';

var Keys = _keycodes.applyDecls();

export default declMod(
  function (_ref) {
    var autoclosable = _ref.autoclosable,
      onOutsideClick = _ref.onOutsideClick,
      onClose = _ref.onClose;
    return autoclosable || onOutsideClick || onClose;
  },
  {
    block: 'popup2',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this._onDocKeyDown = this._onDocKeyDown.bind(this);
      this._onOutsideClick = this._onOutsideClick.bind(this);
      this.toggleWatchAutoClosableEvents = this.toggleWatchAutoClosableEvents.bind(this);
    },
    didMount: function didMount() {
      this.__base();

      if (this.props.visible) {
        this.toggleWatchAutoClosableEvents(true);
      }
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var _this = this;

      var visible = _ref2.visible;

      this.__base.apply(this, arguments);

      if (this.props.visible === visible) {
        return;
      }

      // Клик, открывающий попап, не должен рассматриваться как outsideClick.
      setTimeout(function () {
        return _this.toggleWatchAutoClosableEvents(visible);
      }, 0);
    },
    willUnmount: function willUnmount() {
      this.__base();
      this.toggleWatchAutoClosableEvents(false);
    },
    toggleWatchAutoClosableEvents: function toggleWatchAutoClosableEvents(watch) {
      if (watch) {
        window.addEventListener('keydown', this._onDocKeyDown);
        window.addEventListener('click', this._onOutsideClick);
      } else {
        window.removeEventListener('keydown', this._onDocKeyDown);
        window.removeEventListener('click', this._onOutsideClick);
      }
    },
    _anchor: function _anchor() {
      var anchor = this.props.anchor;

      return anchor && anchor.call ? anchor() : anchor;
    },
    _isElementOutside: function _isElementOutside(element) {
      if (this.containerRef.current.contains(element) || this.isElementInsideChildPopups(element)) {
        return false;
      }

      var anchorDOM = findDOMNode(this._anchor());

      return !(anchorDOM && anchorDOM.contains(element));
    },
    _onOutsideClick: function _onOutsideClick(e) {
      if (this._isElementOutside(e.target)) {
        var onCloseHandler = this.props.onClose || this.props.onOutsideClick;

        onCloseHandler && onCloseHandler(e);
      }
    },
    _onDocKeyDown: function _onDocKeyDown(e) {
      if (e.keyCode === Keys.ESC && !this._hasOpenedChildPopups) {
        var onCloseHandler = this.props.onClose || this.props.onOutsideClick;

        onCloseHandler && onCloseHandler(e);
      }
    },
  },
  {
    propTypes: {
      onOutsideClick: function onOutsideClick(_ref3) {
        var autoclosable = _ref3.autoclosable;

        return (autoclosable ? PropTypes.func.isRequired : PropTypes.func).apply(undefined, arguments);
      },
    },
  },
);
