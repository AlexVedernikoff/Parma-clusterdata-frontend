import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { declMod } from '@kamatech-lego/i-bem-react';

export default declMod(
  { target: 'anchor' },
  {
    block: 'popup2',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      /*%%%ISLDEBUG%%%*/ +0 &&
        console.assert(
          typeof this.props.anchor === 'function',
          'Передача ссылки на элемент в anchor является устаревшим, ' +
            'и в следующей мажорной версии перестанет работать. ' +
            'В anchor необходимо передать функцию, которая должна возвращать ссылку на элемент.',
        );

      this._onDocumentChange = this._onDocumentChange.bind(this);
    },
    toggleWatchBaseEvents: function toggleWatchBaseEvents(watch) {
      this.__base.apply(this, arguments);

      if (watch) {
        document.addEventListener('documentchange', this._onDocumentChange);
      } else {
        document.removeEventListener('documentchange', this._onDocumentChange);
      }
    },
    _onDocumentChange: function _onDocumentChange() {
      // Используем low-level API для ре-рендера
      // это необходимо, для того, чтобы разместить popup в другом положении
      this.forceUpdate();
    },

    _getAnchorDomNode: function _getAnchorDomNode(anchor) {
      return typeof anchor === 'function' ? anchor() : anchor;
    },
    _calcBestDrawingParams: function _calcBestDrawingParams(_ref) {
      var anchor = _ref.anchor;

      var base = this.__base.apply(this, arguments);

      anchor = findDOMNode(this._getAnchorDomNode(anchor));

      var fixedAnchor = this._getFirstFixedParent(anchor);

      if (fixedAnchor) {
        var fixedLeftOffset = 0;
        var fixedTopOffset = 0;

        var fixedScope = this._getFirstFixedParent(this._scope);

        if (fixedScope) {
          var _fixedScope$getBoundi = fixedScope.getBoundingClientRect(),
            left = _fixedScope$getBoundi.left,
            top = _fixedScope$getBoundi.top;

          fixedLeftOffset = left;
          fixedTopOffset = top;
        }

        base.left -= window.pageXOffset - fixedLeftOffset;
        base.top -= window.pageYOffset - fixedTopOffset;
      }

      this._style.popup.position = fixedAnchor ? 'fixed' : '';

      return base;
    },
    _getFirstFixedParent: function _getFirstFixedParent(elem) {
      while (elem) {
        if (elem.nodeType === 1 && getComputedStyle(elem).getPropertyValue('position') === 'fixed') {
          return elem;
        }

        elem = elem.parentNode;
      }
    },
    _calcTargetDimensions: function _calcTargetDimensions(_ref2) {
      var anchor = _ref2.anchor;

      this.__base.apply(this, arguments);

      // При первом рендере anchor может быть не установлен
      if (anchor === undefined || anchor === null) {
        return { left: 0, top: 0, width: 0, height: 0 };
      }

      var normalizedAnchor = findDOMNode(this._getAnchorDomNode(anchor));

      var _normalizedAnchor$get = normalizedAnchor.getBoundingClientRect(),
        left = _normalizedAnchor$get.left,
        top = _normalizedAnchor$get.top;

      // В ie10 document.documentElement.getBoundingClientRect() всегда будет возвращать
      // 0 для top, поэтому использовать его нельзя.

      return {
        left: left + window.pageXOffset,
        top: top + window.pageYOffset,
        width: normalizedAnchor.offsetWidth,
        height: normalizedAnchor.offsetHeight,
      };
    },
  },
  {
    propTypes: {
      anchor: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
    },
  },
);
