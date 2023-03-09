import React from 'react';
import PropTypes from 'prop-types';
import block from 'bem-cn-lite';

// import './RoundIcon.scss';

const b = block('yc-round-icon');

const propTypes = {
    children: PropTypes.node.isRequired,
    itemIndex: PropTypes.number,
    withShadow: PropTypes.bool,
    className: PropTypes.string
};

const defaultProps = {
    itemIndex: 0,
    withShadow: false
};

const POSSIBLE_COLORS = ['blue', 'yellow', 'red', 'green'];

export default function RoundIcon({children, itemIndex, withShadow, className}) {
    const color = POSSIBLE_COLORS[itemIndex % POSSIBLE_COLORS.length];

    return (
        <div className={b({color, shadow: withShadow}, className)}>
            {children}
        </div>
    );
}

RoundIcon.propTypes = propTypes;
RoundIcon.defaultProps = defaultProps;
