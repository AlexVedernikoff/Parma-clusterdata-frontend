var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import PropTypes from 'prop-types';
import { declMod } from '@parma-lego/i-bem-react';

export default declMod({ view: 'default' }, {
    block: 'menu',
    mods: function mods(_ref) {
        var tone = _ref.tone,
            size = _ref.size;

        return _extends({}, this.__base.apply(this, arguments), {
            tone: tone || 'default',
            size: size || 'n'
        });
    }
}, {
    propTypes: {
        tone: PropTypes.string
    }
});