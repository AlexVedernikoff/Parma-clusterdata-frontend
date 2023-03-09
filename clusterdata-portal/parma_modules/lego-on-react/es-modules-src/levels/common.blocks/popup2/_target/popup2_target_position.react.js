import { declMod } from '@parma-lego/i-bem-react';

// NOTE: потому что нужно гарантировать defaultMainOffset
import "../popup2.react.js";
import "../_theme/popup2_theme_normal.react.js";
// import "./../popup2.css";
// import "./../_theme/popup2_theme_normal.css";


export default declMod({ target: 'position' }, {
    block: 'popup2',
    willInit: function willInit() {
        this.__base.apply(this, arguments);

        this.defaultMainOffset = 0;
        this.defaultViewportOffset = 0;
    },
    _calcTargetDimensions: function _calcTargetDimensions(_ref) {
        var position = _ref.position;
        var left = position.left,
            top = position.top;


        return {
            left: left,
            top: top,
            width: 0,
            height: 0
        };
    }
});