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
import { findDOMNode } from 'react-dom';
import { declMod, bool2string } from '@kamatech-lego/i-bem-react';

import throttle from 'lodash.throttle';

import '../popup2.react.js';
import '../_target/popup2_target_anchor.react.js';
// import "./../popup2.css";

export default declMod(
  { hiding: '*', target: 'anchor' },
  {
    block: 'popup2',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this._anchorParents = [];
      this._updateIsAnchorVisible = throttle(
        this._updateIsAnchorVisible,
        this.__self.UPDATE_TARGET_VISIBILITY_THROTTLING_INTERVAL,
      );

      this._onAnchorParentsScroll = this._onAnchorParentsScroll.bind(this);
    },
    mods: function mods(_ref) {
      var hiding = _ref.hiding;

      return _extends({}, this.__base.apply(this, arguments), {
        hiding: bool2string(hiding),
      });
    },
    willReceiveProps: function willReceiveProps(_ref2) {
      var visible = _ref2.visible,
        anchor = _ref2.anchor;

      this.__base.apply(this, arguments);

      if (visible && !this.props.visible) {
        this._bindToAnchorParents(anchor);
      } else if (this.props.visible && !visible) {
        this._unbindFromAnchorParents();
      }
    },
    didMount: function didMount() {
      this.__base.apply(this, arguments);

      // В случае, если popup изначально рисуется видимым.
      if (this.props.visible && this.props.anchor) {
        this._bindToAnchorParents(this.props.anchor);
      }
    },
    willUnmount: function willUnmount() {
      this.__base.apply(this, arguments);
      this._unbindFromAnchorParents();
    },
    _bindToAnchorParents: function _bindToAnchorParents(anchor) {
      var _this = this;

      this._anchorParents = this._getAnchorParents(anchor);

      this._anchorParents.forEach(function(parent) {
        parent.addEventListener('scroll', _this._onAnchorParentsScroll);
      });
    },
    _unbindFromAnchorParents: function _unbindFromAnchorParents() {
      var _this2 = this;

      this._anchorParents.forEach(function(parent) {
        parent.removeEventListener('scroll', _this2._onAnchorParentsScroll);
      });
    },
    _getAnchorParents: function _getAnchorParents(anchor) {
      var anchorParents = [];

      // Делается для удобства обхода:
      // единообразие с parentPopup из контекста.
      var popup = { anchor: anchor };

      var parentPopup = this.context.parentPopup;

      while (parentPopup && parentPopup.anchor) {
        popup = parentPopup;
        parentPopup = popup.instance.context.parentPopup;
      }

      var anchorNode = this._getAnchorDomNode(popup.anchor);
      var node = findDOMNode(anchorNode);

      while (node.parentNode && node.parentNode.tagName !== 'BODY') {
        anchorParents.push(node.parentNode);
        node = node.parentNode;
      }

      return anchorParents;
    },
    _calcBestDrawingParams: function _calcBestDrawingParams(_ref3) {
      var anchor = _ref3.anchor;

      var base = this.__base.apply(this, arguments);

      if (this._isAnchorVisible === undefined) {
        this._isAnchorVisible = this._calcIsAnchorVisible(anchor, base.direction);
      }

      this._style.popup.display = this._isAnchorVisible ? '' : 'none';
      return base;
    },

    _checkDirection: function _checkDirection(direction, directionPart) {
      return direction.indexOf(directionPart) >= 0;
    },

    _onAnchorParentsScroll: function _onAnchorParentsScroll() {
      this._updateIsAnchorVisible();
      this.forceUpdate();
    },
    _updateIsAnchorVisible: function _updateIsAnchorVisible() {
      var isAnchorVisible = this._calcIsAnchorVisible(this.props.anchor, this._direction);

      if (isAnchorVisible !== this._isAnchorVisible) {
        this._isAnchorVisible = isAnchorVisible;
        this.containerRef.current.style.display = this._isAnchorVisible ? '' : 'none';
      }
    },
    _calcIsAnchorVisible: function _calcIsAnchorVisible(anchor, direction) {
      var anchorDOMNode = findDOMNode(this._getAnchorDomNode(anchor));

      var _anchorDOMNode$getBou = anchorDOMNode.getBoundingClientRect(),
        anchorLeft = _anchorDOMNode$getBou.left,
        anchorTop = _anchorDOMNode$getBou.top;

      var anchorRight = anchorLeft + anchorDOMNode.offsetWidth;
      var anchorBottom = anchorTop + anchorDOMNode.offsetHeight;

      var vertBorder = Math.floor(
        this._checkDirection(direction, 'top') ? anchorTop : anchorBottom,
      );
      var horizBorder = Math.floor(
        this._checkDirection(direction, 'left') ? anchorLeft : anchorRight,
      );

      for (var i = 0; i < this._anchorParents.length; i++) {
        var parent = this._anchorParents[i];
        var parentCss = window.getComputedStyle(parent);

        var re = /scroll|hidden|auto/,
          hasOverflowY = re.test(parentCss['overflow-y']),
          hasOverflowX = re.test(parentCss['overflow-x']);

        if (hasOverflowY || hasOverflowX) {
          var parentOffsets = parent.getBoundingClientRect(),
            parentTopOffset = Math.floor(parentOffsets.top);

          if (
            vertBorder < parentTopOffset ||
            parentTopOffset + parent.offsetHeight < vertBorder
          ) {
            return false;
          }

          var parentLeftOffset = Math.floor(parentOffsets.left);
          return (
            horizBorder >= parentLeftOffset &&
            parentLeftOffset + parent.offsetWidth >= horizBorder
          );
        }
      }

      return true;
    },
  },
  {
    propTypes: {
      anchor: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
      hiding: PropTypes.bool,
    },
  },
);
