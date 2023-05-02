import { declMod } from '@kamatech-lego/i-bem-react';
import '../../popup2/popup2.react.js';
import '../../popup2/_autoclosable/popup2_autoclosable_yes.react.js';
// import "./../../popup2/popup2.css";

export default declMod(
  function(_ref) {
    var autoclosable = _ref.autoclosable,
      onOutsideClick = _ref.onOutsideClick;
    return autoclosable || onOutsideClick;
  },
  {
    block: 'modal',

    /**
     * @override
     */
    _isElementOutside: function _isElementOutside(element) {
      return this.containerRef.current.contains(element) && !this._contentElement.contains(element);
    },
  },
);
