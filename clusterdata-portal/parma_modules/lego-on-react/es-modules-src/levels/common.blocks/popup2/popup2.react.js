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

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
}

import React from 'react';
import { createPortal, findDOMNode } from 'react-dom';
import Bem, { decl, bool2string } from '@parma-lego/i-bem-react';
import PropTypes from 'prop-types';

import _popup2__tail from './__tail/popup2__tail.react.js';

var PopupTail = _popup2__tail.applyDecls();

// import "./__tail/popup2__tail.css";

export var AVAILABLE_DIRECTIONS = [
  'bottom-left',
  'bottom-center',
  'bottom-right',
  'top-left',
  'top-center',
  'top-right',
  'right-top',
  'right-center',
  'right-bottom',
  'left-top',
  'left-center',
  'left-bottom',
];

export default decl(
  {
    block: 'popup2',
    getChildContext: function getChildContext() {
      return {
        registerChildPopup: this._registerChildPopup,
        unRegisterChildPopup: this._unRegisterChildPopup,
        parentPopup: {
          anchor: this.props.anchor,
          instance: this,
        },
        zIndexGroupLevel: this._zIndexGroupLevel,
        tailStyles: this._style.tail,
        setTailRef: this.setTailRef,
      };
    },
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      /*%%%ISLDEBUG%%%*/ +0 &&
        console.assert(
          typeof this.props.scope === 'function',
          'Передача ссылки на элемент в scope является устаревшим подходом ' +
            'и в следующей мажорной версии перестанет работать. ' +
            'В scope необходимо передать функцию, которая должна возвращать ссылку на элемент.',
        );

      /*%%%ISLDEBUG%%%*/ +0 &&
        console.assert(
          typeof this.props.onOutsideClick !== 'undefined',
          'onOutsideClick является устаревшим свойством ' +
            'и в следующей мажорной версии перестанет работать. ' +
            'Необходимо использовать свойство onClose.',
        );

      this.state = {
        scope: this.normalizeScope(this.props.scope),
      };
      // isMounted() использовать нельзя, поэтому делаем свой флаг для проверки установки
      this._isMounted = false;
      // Используем значения по умолчанию не в defaultProps, т.к. они могут затереться в модификаторе
      this.defaultMainOffset = 0;
      this.defaultViewportOffset = 0;
      this.drawn = false;
      // Используем ref с такой структурой, чтобы в будущем использовать createRef()
      this.containerRef = { current: null };
      this._style = { popup: {}, tail: {} };
      this._childPopups = [];
      this._hasOpenedChildPopups = false;
      this._zIndex = null;
      this._zIndexGroupLevel = null;

      this._onWinScrollAndResize = this._onWinScrollAndResize.bind(this);
      this._registerChildPopup = this._registerChildPopup.bind(this);
      this._unRegisterChildPopup = this._unRegisterChildPopup.bind(this);
      this.toggleWatchBaseEvents = this.toggleWatchBaseEvents.bind(this);
      this.setTailRef = this.setTailRef.bind(this);
      this.attachContainerRef = this.attachContainerRef.bind(this);
    },
    didMount: function didMount() {
      var _this = this;

      this._isMounted = true;

      if (typeof this.context.registerChildPopup === 'function') {
        this.context.registerChildPopup(this);
      }

      if (this.props.visible) {
        // Используем low-level API для ре-рендера
        // это необходимо, для того, чтобы проставить ссылки на DOM узлы
        this.forceUpdate();
        // Необходимо для React.hydrate при начальном visible = true
        requestAnimationFrame(function() {
          return _this.forceUpdate();
        });

        this.toggleWatchBaseEvents(true);
      }
    },
    willReceiveProps: function willReceiveProps(nextProps) {
      var _this2 = this;

      var prevScope = this.normalizeScope(this.props.scope);
      var nextScope = this.normalizeScope(nextProps.scope);

      if (prevScope !== nextScope) {
        this.setState({ scope: nextScope });
      }

      if (this.props.visible === nextProps.visible) {
        return;
      }

      if (!nextProps.visible) {
        this._releaseZIndex();
      }

      if (nextProps.visible) {
        // При первой отрисовке контейнера большой высоты,
        // координаты в методе _calcBestDrawingParams рассчитываются неправильно,
        // поэтому необходимо сделать обновление в следующем тике для перерасчета
        requestAnimationFrame(function() {
          if (_this2._isMounted) {
            _this2.forceUpdate();
          }
        });
      }

      this.toggleWatchBaseEvents(nextProps.visible);
    },
    willUnmount: function willUnmount() {
      this._isMounted = false;

      if (typeof this.context.unRegisterChildPopup === 'function') {
        this.context.unRegisterChildPopup(this);
      }

      this.toggleWatchBaseEvents(false);
    },
    render: function render() {
      var _this3 = this;

      // При SSR нельзя использовать Portals, так как он использует браузерное API.
      // isMounted проверяется для правильного расчета координат
      if (typeof window === 'undefined' || !this._isMounted) {
        return null;
      }

      var scope = this.state.scope;
      var _props = this.props,
        hasTail = _props.hasTail,
        tailSize = _props.tailSize,
        visible = _props.visible;

      if (visible && this.containerRef.current !== null) {
        var _calcBestDrawingParam = this._calcBestDrawingParams(this.props),
          tail = _calcBestDrawingParam.tail,
          direction = _calcBestDrawingParam.direction,
          positions = _objectWithoutProperties(_calcBestDrawingParam, ['tail', 'direction']);

        var scopeOffsets = scope.getBoundingClientRect();
        // При [обязательном] наличии у scope position:relative необходимо
        // для корректного отображения popup'a относительно scope.
        // В FF не работает document.body.scrollTop, а в Chrome не работает document.documentElement.scrollTop.
        var left = positions.left - (scopeOffsets.left + window.pageXOffset);
        var top = positions.top - (scopeOffsets.top + window.pageYOffset);

        if (!this.drawn && this.props.visible) {
          this._captureZIndex();
          this.drawn = true;
        }

        if (this.props.calcPossible) {
          this._calcPossibleDrawingParams(this.props);
        }

        this._direction = direction;
        this._style.popup = _extends({}, this._style.popup, { left: left, top: top }, this.props.style);
        this._style.tail = _extends({}, tail, { width: tailSize, height: tailSize });
      }

      return createPortal(
        React.createElement(
          Bem,
          {
            cls: this.cls(this.props),
            tag: this.tag(this.props),
            block: this.block,
            mods: this.mods(this.props),
            mix: this.mix(this.props),
            // React не позволяет изменять объект со стилями, т.к. это anti-pattern
            // поэтому используем spread, чтобы каждый раз получать новый объект
            attrs: _extends({ style: _extends({}, this._style.popup) }, this.attrs(this.props)),
          },
          hasTail &&
            React.createElement(PopupTail, {
              style: _extends({}, this._style.tail),
              ref: function ref(instance) {
                return (_this3.domElementTail = findDOMNode(instance));
              },
            }),
          this.content(this.props),
        ),
        scope,
      );
    },
    mods: function mods(_ref) {
      var theme = _ref.theme,
        visible = _ref.visible,
        direction = _ref.direction,
        view = _ref.view,
        tone = _ref.tone,
        nonvisual = _ref.nonvisual;

      return {
        view: view,
        tone: tone,
        theme: theme,
        direction: this._direction,
        nonvisual: bool2string(nonvisual),
        visible: bool2string(visible),
      };
    },
    attrs: function attrs(_ref2) {
      var onClick = _ref2.onClick,
        onMouseOver = _ref2.onMouseOver,
        onMouseLeave = _ref2.onMouseLeave;

      return _extends({}, this.__base.apply(this, arguments), {
        onClick: onClick,
        onMouseOver: onMouseOver,
        onMouseLeave: onMouseLeave,
        ref: this.attachContainerRef,
      });
    },
    toggleWatchBaseEvents: function toggleWatchBaseEvents(watch) {
      if (watch) {
        window.addEventListener('scroll', this._onWinScrollAndResize);
        window.addEventListener('resize', this._onWinScrollAndResize);
      } else {
        window.removeEventListener('scroll', this._onWinScrollAndResize);
        window.removeEventListener('resize', this._onWinScrollAndResize);
      }
    },

    /**
     * Нормализует ссылку на scope.
     *
     * @private
     *
     * @param {HTMLElement | Function} scope
     * @return {HTMLElement} DOM узел
     */
    normalizeScope: function normalizeScope(scope) {
      return typeof scope !== 'function' ? scope : scope();
    },

    /**
     * Устанавливает ссылку на DOM узел.
     *
     * @private
     *
     * @param {HTMLElement} node DOM узел
     */
    attachContainerRef: function attachContainerRef(node) {
      this.containerRef.current = node;
    },

    /**
     * @param {ReactComponent} popup
     * @private
     */
    _registerChildPopup: function _registerChildPopup(popup) {
      this._childPopups.push(popup);
    },

    /**
     * @param {ReactComponent} popup
     * @private
     */
    _unRegisterChildPopup: function _unRegisterChildPopup(popup) {
      var index = this._childPopups.indexOf(popup);
      if (index !== -1) {
        this._childPopups.splice(index, 1);
      }
    },

    /**
     * @param {Element} element
     * @returns {boolean}
     */
    isElementInsideChildPopups: function isElementInsideChildPopups(element) {
      return this._childPopups.some(function(popup) {
        return popup.containerRef.current.contains(element) || popup.isElementInsideChildPopups(element);
      });
    },
    _onWinScrollAndResize: function _onWinScrollAndResize() {
      // Используем low-level API для ре-рендера
      // это необходимо, для того, чтобы разместить popup в другом положении
      this.forceUpdate();
    },
    _calcPossibleDrawingParams: function _calcPossibleDrawingParams(props) {
      var _this4 = this;

      var target = this._calcTargetDimensions(props);
      var viewport = this._calcViewportDimensions();
      var offsets = this._calcOffsets();
      var directions = this.props.directions.map(function(direction) {
        var res = { direction: direction, width: 0, height: 0, left: 0, top: 0 };

        if (_this4._checkMainDirection(direction, 'bottom')) {
          res.top = target.top + target.height + offsets.main;
          res.height = viewport.bottom - res.top - offsets.viewport;
        } else if (_this4._checkMainDirection(direction, 'top')) {
          res.height = target.top - viewport.top - offsets.main - offsets.viewport;
          res.top = target.top - res.height - offsets.main;
        } else {
          if (_this4._checkSecondaryDirection(direction, 'center')) {
            res.height = viewport.bottom - viewport.top - 2 * offsets.viewport;
            res.top = target.top + (target.height - res.height) / 2;
          } else if (_this4._checkSecondaryDirection(direction, 'bottom')) {
            res.height = target.top + target.height - viewport.top - offsets.secondary - offsets.viewport;
            res.top = target.top + target.height - res.height - offsets.secondary;
          } else if (_this4._checkSecondaryDirection(direction, 'top')) {
            res.top = target.top + offsets.secondary;
            res.height = viewport.bottom - res.top - offsets.viewport;
          }

          if (_this4._checkMainDirection(direction, 'left')) {
            res.width = target.left - viewport.left - offsets.main - offsets.viewport;
            res.left = target.left - res.width - offsets.main;
          } else {
            res.left = target.left + target.width + offsets.main;
            res.width = viewport.right - res.left - offsets.viewport;
          }
        }

        if (_this4._checkSecondaryDirection(direction, 'right')) {
          res.width = target.left + target.width - viewport.left - offsets.secondary - offsets.viewport;
          res.left = target.left + target.width - res.width - offsets.secondary;
        } else if (_this4._checkSecondaryDirection(direction, 'left')) {
          res.left = target.left + offsets.secondary;
          res.width = viewport.right - res.left - offsets.viewport;
        } else if (_this4._checkSecondaryDirection(direction, 'center')) {
          if (_this4._checkMainDirection(direction, 'top', 'bottom')) {
            res.width = viewport.right - viewport.left - 2 * offsets.viewport;
            res.left = target.left + target.width / 2 - res.width / 2;
          }
        }

        return res;
      });

      this.props.calcPossible(directions);
    },
    _calcBestDrawingParams: function _calcBestDrawingParams(props) {
      var popup = this._calcPopupDimensions();
      var target = this._calcTargetDimensions(props);
      var viewport = this._calcViewportDimensions();
      var directions = props.directions;

      var directionsLength = directions.length;

      var direction = void 0,
        pos = void 0,
        viewportFactor = void 0,
        bestDirection = void 0,
        bestPos = void 0,
        bestViewportFactor = void 0;

      for (var i = 0; i < directionsLength; i++) {
        direction = directions[i];
        pos = this._calcPos(direction, target, popup);
        viewportFactor = this._calcViewportFactor(pos, viewport, popup);

        if (i === 0 || viewportFactor > bestViewportFactor || (!bestViewportFactor && props.direction === direction)) {
          bestDirection = direction;
          bestViewportFactor = viewportFactor;
          bestPos = pos;
        }

        if (bestViewportFactor > this.__self.VIEWPORT_ACCURACY_FACTOR) {
          break;
        }
      }

      return {
        direction: bestDirection,
        left: bestPos.left,
        top: bestPos.top,
        tail: this._calcTailPos(bestDirection, target, popup, bestPos),
      };
    },
    _calcPopupDimensions: function _calcPopupDimensions() {
      var _containerRef$current = this.containerRef.current,
        clientWidth = _containerRef$current.clientWidth,
        clientHeight = _containerRef$current.clientHeight;

      var _containerRef$current2 = this.containerRef.current.getBoundingClientRect(),
        width = _containerRef$current2.width,
        height = _containerRef$current2.height;

      return {
        // Погрешность при расчете offsetWidth при рендеринге в chrome
        width: Math.round(width),
        // Погрешность расчета при рендеринге IE11
        height: Math.round(height),
        popupWidth: clientWidth,
        popupHeight: clientHeight,
        area: clientWidth * clientHeight,
      };
    },
    _calcTargetDimensions: function _calcTargetDimensions(_ref3) {
      var target = _ref3.target,
        position = _ref3.position;

      if (!target && !position) {
        return { left: 0, top: 0, width: 0, height: 0 };
      }

      return _extends({}, position, { width: 0, height: 0 });
    },
    _calcTailDimension: function _calcTailDimension() {
      if (this.props.tailSize) {
        return this.props.tailSize;
      }
      // В IE9 .outerWidth() возвращает ширину элемента, даже если он скрыт, поэтому явно проверяем на display: none;
      if (this.domElementTail && this.domElementTail.style.display !== 'none') {
        return this.domElementTail.offsetWidth;
      }

      return 0;
    },
    _calcViewportDimensions: function _calcViewportDimensions() {
      var winTop = window.pageYOffset;
      var winLeft = window.pageXOffset;
      var winWidth = window.innerWidth;
      var winHeight = window.innerHeight;

      return {
        top: winTop,
        left: winLeft,
        bottom: winTop + winHeight,
        right: winLeft + winWidth,
      };
    },
    _calcPos: function _calcPos(direction, target, popup) {
      var res = {};
      var offsets = this._calcOffsets();

      if (this._checkMainDirection(direction, 'bottom')) {
        res.top = target.top + target.height + offsets.main;
      } else if (this._checkMainDirection(direction, 'top')) {
        res.top = target.top - popup.height - offsets.main;
      } else if (this._checkMainDirection(direction, 'left')) {
        res.left = target.left - popup.width - offsets.main;
      } else if (this._checkMainDirection(direction, 'right')) {
        res.left = target.left + target.width + offsets.main;
      }

      if (this._checkSecondaryDirection(direction, 'right')) {
        res.left = target.left + target.width - popup.width - offsets.secondary;
      } else if (this._checkSecondaryDirection(direction, 'left')) {
        res.left = target.left + offsets.secondary;
      } else if (this._checkSecondaryDirection(direction, 'bottom')) {
        res.top = target.top + target.height - popup.height - offsets.secondary;
      } else if (this._checkSecondaryDirection(direction, 'top')) {
        res.top = target.top + offsets.secondary;
      } else if (this._checkSecondaryDirection(direction, 'center')) {
        if (this._checkMainDirection(direction, 'top', 'bottom')) {
          res.left = target.left + target.width / 2 - popup.width / 2;
        } else if (this._checkMainDirection(direction, 'left', 'right')) {
          res.top = target.top + target.height / 2 - popup.height / 2;
        }
      }

      return res;
    },
    _calcViewportFactor: function _calcViewportFactor(pos, viewport, popup) {
      var viewportOffset = this.props.viewportOffset || this.defaultViewportOffset;
      var intersectionLeft = Math.max(pos.left, viewport.left + viewportOffset);
      var intersectionRight = Math.min(pos.left + popup.width, viewport.right - viewportOffset);
      var intersectionTop = Math.max(pos.top, viewport.top + viewportOffset);
      var intersectionBottom = Math.min(pos.top + popup.height, viewport.bottom - viewportOffset);

      if (!(intersectionLeft < intersectionRight && intersectionTop < intersectionBottom)) {
        // Нет пересечения
        return 0;
      }

      return ((intersectionRight - intersectionLeft) * (intersectionBottom - intersectionTop)) / popup.area;
    },
    _calcTailPos: function _calcTailPos(direction, target, popup, pos) {
      var res = {};
      var halfOfTail = this._calcTailDimension() / 2;
      var tailOffset = this.props.tailOffset;

      if (this._checkMainDirection(direction, 'bottom')) {
        res.top = -halfOfTail;
      } else if (this._checkMainDirection(direction, 'top')) {
        res.top = Math.floor(popup.popupHeight - halfOfTail);
      } else if (this._checkMainDirection(direction, 'left')) {
        res.left = Math.floor(popup.popupWidth - halfOfTail);
      } else if (this._checkMainDirection(direction, 'right')) {
        res.left = -halfOfTail;
      }

      if (this._checkSecondaryDirection(direction, 'right')) {
        res.left = popup.popupWidth - Math.ceil(Math.min(popup.popupWidth, target.width) / 2) - halfOfTail - tailOffset;
      } else if (this._checkSecondaryDirection(direction, 'left')) {
        res.left = Math.ceil(Math.min(popup.popupWidth, target.width) / 2) - halfOfTail + tailOffset;
      } else if (this._checkSecondaryDirection(direction, 'bottom')) {
        res.top =
          popup.popupHeight - Math.ceil(Math.min(popup.popupHeight, target.height) / 2) - halfOfTail - tailOffset;
      } else if (this._checkSecondaryDirection(direction, 'top')) {
        res.top = Math.ceil(Math.min(popup.popupHeight, target.height) / 2) - halfOfTail + tailOffset;
      } else if (this._checkSecondaryDirection(direction, 'center')) {
        if (this._checkMainDirection(direction, 'top', 'bottom')) {
          res.left = Math.ceil(popup.popupWidth / 2) - halfOfTail + tailOffset;
        } else {
          res.top = Math.ceil(popup.popupHeight / 2) - halfOfTail + tailOffset;
        }
      }

      return res;
    },
    _calcOffsets: function _calcOffsets() {
      var tailDimension = this._calcTailDimension();
      var mainOffset = this.props.mainOffset === undefined ? this.defaultMainOffset : this.props.mainOffset;

      return {
        main:
          mainOffset >= 0 && tailDimension > 0
            ? Math.max(mainOffset, Math.round(tailDimension * Math.SQRT1_2))
            : mainOffset,
        secondary: this.props.secondaryOffset,
        viewport: this.props.viewportOffset || this.defaultViewportOffset,
      };
    },
    _checkMainDirection: function _checkMainDirection(direction, mainDirection1, mainDirection2) {
      return direction.indexOf(mainDirection1) === 0 || (mainDirection2 && direction.indexOf(mainDirection2) === 0);
    },
    _checkSecondaryDirection: function _checkSecondaryDirection(direction, secondaryDirection) {
      return direction.indexOf('-' + secondaryDirection) > 0;
    },
    _checkDirection: function _checkDirection(direction, directionPart) {
      return direction.indexOf(directionPart) >= 0;
    },
    _calcZIndexGroupLevel: function _calcZIndexGroupLevel() {
      return this.props.zIndexGroupLevel || this.context.zIndexGroupLevel || 0;
    },

    /**
     * Занимает наименьший свободный z-index в стеке для своего уровня.
     * Выставляет его DOM-элементу.
     * @private
     */
    _captureZIndex: function _captureZIndex() {
      if (this._zIndexGroupLevel === null) {
        this._zIndexGroupLevel = this._calcZIndexGroupLevel();
      }

      var visiblePopupsZIndexes = this.__self._visiblePopupsZIndexes;
      var level = this._zIndexGroupLevel;
      var prevZIndex = this._zIndex;
      var zIndexes = visiblePopupsZIndexes[level];

      if (!zIndexes) {
        zIndexes = visiblePopupsZIndexes[level] = [(level + 1) * this.__self.ZINDEX_FACTOR];
      }

      this._zIndex = zIndexes[zIndexes.length - 1] + 1;
      zIndexes.push(this._zIndex);

      if (this._zIndex !== prevZIndex) {
        this._style.popup.zIndex = this._zIndex;
      }
    },

    /**
     * Освобождает z-index в стеке.
     * @private
     */
    _releaseZIndex: function _releaseZIndex() {
      var zIndexes = this.__self._visiblePopupsZIndexes[this._zIndexGroupLevel];

      /**
       * Проверяем zIndexes, т.к. если изначально отрендерить попап видимым,
       * то объект _visiblePopupsZIndexes будет пустым
       */
      if (zIndexes && zIndexes.length > 1) {
        if (this.drawn) {
          zIndexes.splice(zIndexes.indexOf(this._zIndex), 1);
        }
        this.drawn = false;
      }
    },
    setTailRef: function setTailRef(node) {
      this.domElementTail = node;
    },
  },
  {
    propTypes: {
      theme: PropTypes.string,
      target: PropTypes.oneOf(['anchor', 'position']).isRequired,
      view: PropTypes.oneOf(['classic', 'default']),
      tone: PropTypes.string,
      hiding: PropTypes.bool,
      hasTail: PropTypes.bool,
      tailSize: PropTypes.number,
      position: PropTypes.object,
      autoclosable: PropTypes.bool,
      visible: PropTypes.bool,
      directions: PropTypes.array,
      mainOffset: PropTypes.number,
      zIndexGroupLevel: PropTypes.number,
      secondaryOffset: PropTypes.number,
      viewportOffset: PropTypes.number,
      tailOffset: PropTypes.number,
      onMouseOver: PropTypes.func,
      onMouseLeave: PropTypes.func,
      calcPossible: PropTypes.func,
    },
    defaultProps: {
      view: 'classic',
      target: 'anchor',
      directions: AVAILABLE_DIRECTIONS,
      secondaryOffset: 0,
      tailOffset: 0,
      zIndexGroupLevel: 0,
      scope: typeof document === 'undefined' ? null : document.body,
    },
    _visiblePopupsZIndexes: {},
    ZINDEX_FACTOR: 1000,
    VIEWPORT_ACCURACY_FACTOR: 0.99,
    UPDATE_TARGET_VISIBILITY_THROTTLING_INTERVAL: 100,
    contextTypes: {
      registerChildPopup: PropTypes.func,
      unRegisterChildPopup: PropTypes.func,
      zIndexGroupLevel: PropTypes.number,
      parentPopup: PropTypes.object,
    },
    childContextTypes: {
      registerChildPopup: PropTypes.func,
      unRegisterChildPopup: PropTypes.func,
      zIndexGroupLevel: PropTypes.number,
      parentPopup: PropTypes.object,
      tailStyles: PropTypes.object,
      setTailRef: PropTypes.func,
    },
  },
);
