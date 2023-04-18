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
    block: 'tooltip',
    elem: 'close',
    willInit: function willInit() {
      this.__base.apply(this, arguments);

      this._onClick = this._onClick.bind(this);
    },
    attrs: function attrs() {
      return _extends({}, this.__base.apply(this, arguments), {
        onClick: this._onClick,
        title: 'Закрыть',
      });
    },
    _onClick: function _onClick(e) {
      this.props.onClick && this.props.onClick(e);
    },
  },
  {
    propTypes: {
      onClick: PropTypes.func,
    },
  },
);
