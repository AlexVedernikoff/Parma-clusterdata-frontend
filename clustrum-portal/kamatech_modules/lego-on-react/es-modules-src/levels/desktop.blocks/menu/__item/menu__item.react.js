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
import { decl } from '@kamatech-lego/i-bem-react';

export default decl(
  {
    block: 'menu',
    elem: 'item',
    // hovered у menu__item выставляется через внутренний state,
    // чтобы menu было в курсе происходящего, выставление hovered
    // обрабатывается здесь с использованием контекста.
    willUpdate: function willUpdate(nextProps, nextState) {
      if (!this.state.hovered && nextState.hovered) {
        this.context.removeHover();
        this.context.hoverItem(this);
      }
    },
    attrs: function attrs() {
      // meni__item должен уметь обрабатывать фокус даже
      // в состоянии disabled. В противном случае в IE событие всплывет к menu
      // и оно подсветит первый __item.
      return _extends({}, this.__base.apply(this, arguments), {
        onFocus: this.onFocus,
        onBlur: this.onBlur,
      });
    },
    onFocus: function onFocus(e) {
      // Нужно для select2.
      // В ie по клику на menu__item происходят focusin/focusout.
      // Событие focusin всплывает и провоцирует выделение первого menu__item,
      // а затем, при переводе фокуса на кнопку, выделение пропадает -
      // получается неприятное моргание.
      if (this.context.isIE) {
        e.stopPropagation();
        return;
      }

      if (this.state.disabled) {
        return false;
      }

      this.setState({ hovered: true });
      this.props.onFocus && this.props.onFocus(e);
    },
    onBlur: function onBlur(e) {
      if (this.context.isIE) {
        e.stopPropagation();
        return;
      }

      if (this.state.disabled) {
        return false;
      }

      this.setState({ hovered: false });
      this.props.onBlur && this.props.onBlur(e);
    },
    onMouseLeave: function onMouseLeave(e) {
      this.__base.apply(this, arguments);
      this.context.removeHover();
    },
  },
  {
    contextTypes: {
      hoverItem: PropTypes.func,
      removeHover: PropTypes.func,
      registerItem: PropTypes.func,
      unregisterItem: PropTypes.func,
      isIE: PropTypes.bool,
    },
  },
);
