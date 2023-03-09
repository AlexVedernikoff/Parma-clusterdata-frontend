import PropTypes from 'prop-types';
import { declMod } from '@parma-lego/i-bem-react';

export default declMod({ type: 'check' }, {
    block: 'button2',
    onClick: function onClick(e) {
        this.__base.apply(this, arguments);
        this.setState({ checked: !this.state.checked });
    }
}, {
    propTypes: {
        checked: PropTypes.bool,
        type: PropTypes.string
    }
});