var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import PropTypes from 'prop-types';
import { declMod } from '@parma-lego/i-bem-react';

export default declMod({ view: 'default' }, {
    block: 'select2',
    mods: function mods(_ref) {
        var tone = _ref.tone;

        return _extends({}, this.__base.apply(this, arguments), {
            tone: tone
        });
    },

    // У самого селекта, в отличие от кнопки, нет анимации,
    // поэтому попап сразу рассчитывается правильно.
    attrs: function attrs() {
        return _extends({}, this.__base.apply(this, arguments), {
            ref: this._setAnchor
        });
    }
}, {
    propTypes: {
        tone: PropTypes.string
    },
    defaultProps: {
        tone: 'default',
        size: 'n'
    }
});