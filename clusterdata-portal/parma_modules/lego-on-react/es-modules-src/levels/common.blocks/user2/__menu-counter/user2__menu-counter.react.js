import { number } from 'prop-types';
import { decl } from '@parma-lego/i-bem-react';

// import "./user2__menu-counter.css";
// import "./_state/user2__menu-counter_state_empty.css";


export default decl({
    tag: 'span',
    block: 'user2',
    elem: 'menu-counter',

    mods: function mods() {
        var count = this.props.count;

        return {
            state: count === 0 && 'empty'
        };
    },
    content: function content() {
        var _props = this.props,
            count = _props.count,
            maxCount = _props.maxCount;

        return count > maxCount ? maxCount : count;
    }
}, {
    propTypes: {
        count: number.isRequired,
        maxCount: number
    },

    defaultProps: {
        maxCount: 9999
    }
});